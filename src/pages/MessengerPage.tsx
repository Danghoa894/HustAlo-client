import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Icon } from '@/assets/icons';
import { Button, Avatar, SearchBox, EmptyState } from '@/components/common';
import { Conversation, Message, MessageStatus } from '@/types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/utils/constants';

interface MessengerPageProps {
  onToggleList: () => void;
}

// ConversationList Component
interface ConversationListProps {
  selected: number;
  onSelect: (id: number) => void;
  loading: boolean;
}

function ConversationList({ selected, onSelect, loading }: ConversationListProps) {
  const [query, setQuery] = useState('');
  const results = useMemo(
    () =>
      MOCK_CONVERSATIONS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <section className="conversation-panel">
      <header className="list-header">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Không gian làm việc</p>
            <h2 className="mt-1 text-xl font-bold">Tin nhắn</h2>
          </div>
          <Button iconOnly className="soft-button" aria-label="Tạo cuộc trò chuyện mới">
            <Icon name="plus" />
          </Button>
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="Tìm cuộc trò chuyện"
          className="mt-5"
        />
      </header>
      <div className="conversation-scroll">
        {loading ? (
          Array.from({ length: 7 }).map((_, index) => (
            <div className="conversation-skeleton" key={index}>
              <span className="skeleton size-12 rounded-full" />
              <span className="flex-1 space-y-2">
                <span className="skeleton block h-3 w-2/3" />
                <span className="skeleton block h-3 w-full" />
              </span>
            </div>
          ))
        ) : results.length ? (
          results.map((item) => (
            <Button
              key={item.id}
              className={`conversation-item ${selected === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <Avatar name={item.name} online={item.online || item.group} />
              <span className="min-w-0 flex-1 text-left">
                <span className="flex items-center justify-between gap-2">
                  <strong className="truncate text-sm">{item.name}</strong>
                  <time className={item.unread ? 'time-unread' : 'text-muted'}>
                    {item.time}
                  </time>
                </span>
                <span className="mt-1 flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-sm ${
                      item.typing ? 'typing-text' : 'text-muted'
                    }`}
                  >
                    {item.typing ? 'đang nhập...' : item.preview}
                  </span>
                  {item.unread > 0 && <span className="unread-badge">{item.unread}</span>}
                </span>
              </span>
            </Button>
          ))
        ) : (
          <EmptyState
            icon="message"
            title="Chưa có cuộc trò chuyện nào"
            description="Hãy tìm đồng nghiệp và bắt đầu trao đổi."
            action={<Button className="primary-button">Tìm bạn bè</Button>}
          />
        )}
      </div>
    </section>
  );
}

// MessageStatus Component
function MessageStatus({ status }: { status?: MessageStatus }) {
  if (!status) return null;
  if (status === 'seen')
    return (
      <span className="seen-avatar" title="Đã xem">
        MA
      </span>
    );
  if (status === 'sending') return <Icon name="clock" className="size-3.5" />;
  return (
    <span className="checks">
      <Icon name="check" className="size-3.5" />
      {status === 'delivered' && <Icon name="check" className="-ml-2 size-3.5" />}
    </span>
  );
}

// ChatPanel Component
interface ChatPanelProps {
  onBack: () => void;
  onToggleList: () => void;
}

function ChatPanel({ onBack, onToggleList }: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const [localMessages, setLocalMessages] = useState(MOCK_MESSAGES);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editing, setEditing] = useState<Message | null>(null);
  const [actionMessageId, setActionMessageId] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressRef = useRef<number | null>(null);

  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const normalized = searchQuery.trim().toLocaleLowerCase('vi');
    return localMessages
      .filter(
        (message) =>
          !message.recalled && message.text?.toLocaleLowerCase('vi').includes(normalized)
      )
      .slice(0, 12);
  }, [localMessages, searchQuery]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function scrollToMessage(id: number) {
    document.getElementById(`tin-nhan-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    setHighlightedId(id);
    window.setTimeout(() => setHighlightedId(null), 1600);
  }

  function moveSearch(direction: number) {
    if (!searchMatches.length) return;
    const next = (activeResult + direction + searchMatches.length) % searchMatches.length;
    setActiveResult(next);
    scrollToMessage(searchMatches[next].id);
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    if (editing) {
      setLocalMessages((current) =>
        current.map((message) =>
          message.id === editing.id ? { ...message, text, edited: true } : message
        )
      );
      setEditing(null);
    } else {
      setLocalMessages((current) => [
        ...current,
        {
          id: Date.now(),
          from: 'me',
          text,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'sending',
          replyTo: replyingTo
            ? {
                id: replyingTo.id,
                text:
                  replyingTo.recalled
                    ? 'Tin nhắn đã được thu hồi'
                    : replyingTo.text || replyingTo.file?.name || 'Hình ảnh',
                author: replyingTo.from === 'me' ? 'Bạn' : 'Minh Anh',
              }
            : undefined,
        },
      ]);
      setReplyingTo(null);
    }
    setDraft('');
    window.setTimeout(
      () =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }),
      30
    );
  }

  function startReply(message: Message) {
    setReplyingTo(message);
    setEditing(null);
    setActionMessageId(null);
  }

  function startEdit(message: Message) {
    setEditing(message);
    setReplyingTo(null);
    setDraft(message.text || '');
    setActionMessageId(null);
  }

  function recall(message: Message) {
    setLocalMessages((current) =>
      current.map((item) =>
        item.id === message.id
          ? { ...item, text: undefined, image: undefined, file: undefined, recalled: true }
          : item
      )
    );
    setActionMessageId(null);
  }

  async function copyMessage(message: Message) {
    if (!message.text) return;
    await navigator.clipboard?.writeText(message.text);
    setToast('Đã sao chép tin nhắn');
    setActionMessageId(null);
  }

  function canEdit(message: Message) {
    return message.from === 'me' && Boolean(message.text) && !message.recalled && message.id >= 28;
  }

  function canRecall(message: Message) {
    return message.from === 'me' && !message.recalled && message.id >= 20;
  }

  function startLongPress(message: Message) {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    longPressRef.current = window.setTimeout(() => setActionMessageId(message.id), 550);
  }

  function clearLongPress() {
    if (longPressRef.current) window.clearTimeout(longPressRef.current);
    longPressRef.current = null;
  }

  function handleAttachment(file?: File) {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const supported =
      isImage ||
      [
        'application/pdf',
        'text/plain',
        'application/zip',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].includes(file.type);
    if (!supported) return setToast('Không hỗ trợ loại file này');
    if (isImage && file.size > 10 * 1024 * 1024) return setToast('Ảnh tối đa 10 MB');
    if (!isImage && file.size > 25 * 1024 * 1024) return setToast('File tối đa 25 MB');

    const id = Date.now();
    const preview = isImage ? URL.createObjectURL(file) : undefined;
    const uploading: Message = {
      id,
      from: 'me',
      image: preview,
      file: isImage ? undefined : { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` },
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
      uploadProgress: 8,
    };
    setLocalMessages((current) => [...current, uploading]);
    let progress = 8;
    const timer = window.setInterval(() => {
      progress += 14;
      setLocalMessages((current) =>
        current.map((message) =>
          message.id === id
            ? {
                ...message,
                uploadProgress: Math.min(progress, 100),
                status: progress >= 100 ? 'sent' : message.status,
              }
            : message
        )
      );
      if (progress >= 100) window.clearInterval(timer);
    }, 240);
    window.setTimeout(
      () =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }),
      30
    );
  }

  function cancelUpload(id: number) {
    setLocalMessages((current) => current.filter((message) => message.id !== id));
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      window.matchMedia('(min-width: 768px)').matches
    ) {
      event.preventDefault();
      send();
    }
  }

  function MessageActions({ message, sheet = false }: { message: Message; sheet?: boolean }) {
    return (
      <div className={sheet ? 'sheet-actions' : 'message-actions'}>
        <Button onClick={() => startReply(message)}>Trả lời</Button>
        {message.text && !message.recalled && (
          <Button onClick={() => copyMessage(message)}>Sao chép</Button>
        )}
        {canEdit(message) && <Button onClick={() => startEdit(message)}>Chỉnh sửa</Button>}
        {canRecall(message) && (
          <Button className="danger-action" onClick={() => recall(message)}>
            Thu hồi
          </Button>
        )}
      </div>
    );
  }

  const selectedActionMessage = localMessages.find((message) => message.id === actionMessageId);

  return (
    <section className="chat-panel">
      <header className="chat-header">
        <Button
          iconOnly
          className="md:hidden"
          aria-label="Quay lại danh sách"
          onClick={onBack}
        >
          <Icon name="arrow-left" />
        </Button>
        <Button
          iconOnly
          className="hidden lg:flex xl:hidden"
          aria-label="Hiện danh sách hội thoại"
          onClick={onToggleList}
        >
          <Icon name="panel" />
        </Button>
        <Avatar name="Minh Anh" online />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold">Minh Anh</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
            <span className="status-dot" />
            Đang hoạt động
          </p>
        </div>
        <div className="header-actions">
          <Button iconOnly aria-label="Gọi thoại">
            <Icon name="phone" />
          </Button>
          <Button iconOnly aria-label="Gọi video">
            <Icon name="video" />
          </Button>
          <Button
            iconOnly
            aria-label="Tìm trong cuộc trò chuyện"
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (!searchOpen) {
                setSearchQuery('mình');
                setActiveResult(2);
                window.setTimeout(() => scrollToMessage(4), 100);
              }
            }}
          >
            <Icon name="search" />
          </Button>
          <Button iconOnly className="hidden sm:flex" aria-label="Thông tin cuộc trò chuyện">
            <Icon name="info" />
          </Button>
        </div>
      </header>
      <div className={`chat-search ${searchOpen ? 'open' : ''}`}>
        <label className="search-box">
          <Icon name="search" className="size-4" />
          <input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setActiveResult(0);
            }}
            placeholder="Tìm trong cuộc trò chuyện"
          />
          <span className="search-counter">
            {searchMatches.length ? `${Math.min(activeResult + 1, searchMatches.length)}/${searchMatches.length}` : '0/0'}
          </span>
          <Button iconOnly aria-label="Kết quả trước" onClick={() => moveSearch(-1)}>
            <Icon name="chevron" className="-rotate-90 size-4" />
          </Button>
          <Button iconOnly aria-label="Kết quả sau" onClick={() => moveSearch(1)}>
            <Icon name="chevron" className="rotate-90 size-4" />
          </Button>
          <Button iconOnly aria-label="Đóng tìm kiếm" onClick={() => setSearchOpen(false)}>
            ×
          </Button>
        </label>
      </div>
      <div className="offline-banner">
        <Icon name="wifi-off" className="size-3.5" />
        Mất kết nối, đang kết nối lại...
      </div>

      <div className="message-scroll" ref={scrollRef}>
        <div className="old-loader">
          <span className="spinner" />
          Đang tải tin nhắn cũ...
        </div>
        <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-7">
          {localMessages.map((message) => (
            <div key={message.id}>
              {message.date && (
                <div className="date-separator">
                  <span>{message.date}</span>
                </div>
              )}
              <div
                id={`tin-nhan-${message.id}`}
                className={`message-row ${message.from === 'me' ? 'mine' : ''} ${
                  highlightedId === message.id ? 'message-highlight' : ''
                }`}
                onTouchStart={() => startLongPress(message)}
                onTouchEnd={clearLongPress}
                onTouchMove={clearLongPress}
              >
                {message.from === 'other' && (
                  <Avatar name="Minh Anh" size="sm" className="message-avatar" />
                )}
                <div className="message-stack">
                  <MessageActions message={message} />
                  <div
                    className={`message-bubble ${message.from === 'me' ? 'mine' : ''} ${
                      message.image ? 'image-bubble' : ''
                    } ${message.recalled ? 'recalled-bubble' : ''}`}
                  >
                    {message.replyTo && (
                      <Button
                        className="quoted-message"
                        onClick={() => scrollToMessage(message.replyTo!.id)}
                      >
                        <strong>{message.replyTo.author}</strong>
                        <span>{message.replyTo.text}</span>
                      </Button>
                    )}
                    {message.recalled ? (
                      <p>Tin nhắn đã được thu hồi</p>
                    ) : (
                      <>
                        {message.image && (
                          <Button
                            className="image-trigger"
                            onClick={() => setViewerImage(message.image!)}
                          >
                            <img src={message.image} alt="Ảnh đính kèm trong cuộc trò chuyện" />
                          </Button>
                        )}
                        {message.file && (
                          <div className="file-card">
                            <span className="file-icon">
                              <Icon name="file" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <strong>{message.file.name}</strong>
                              <small>Tệp đính kèm · {message.file.size}</small>
                            </span>
                            <Button
                              iconOnly
                              className="download-button"
                              aria-label={`Tải xuống ${message.file.name}`}
                            >
                              <Icon name="chevron" className="rotate-90 size-4" />
                            </Button>
                          </div>
                        )}
                        {message.text && <p>{message.text}</p>}
                        {message.uploadProgress !== undefined && message.uploadProgress < 100 && (
                          <div className="upload-state">
                            <span className="upload-track">
                              <span style={{ width: `${message.uploadProgress}%` }} />
                            </span>
                            <small>{message.uploadProgress}%</small>
                            <Button onClick={() => cancelUpload(message.id)}>Hủy</Button>
                          </div>
                        )}
                      </>
                    )}
                    <span className="message-meta">
                      {message.edited && <em>đã chỉnh sửa</em>}
                      <time>{message.time}</time>
                      {message.from === 'me' && !message.recalled && (
                        <MessageStatus status={message.status} />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="message-row">
            <Avatar name="Minh Anh" size="sm" className="message-avatar" />
            <div className="typing-bubble">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      <footer className="composer-wrap">
        {(replyingTo || editing) && (
          <div className="composer-context">
            <span className="context-line" />
            <span className="min-w-0 flex-1">
              <strong>
                {editing
                  ? 'Đang chỉnh sửa tin nhắn'
                  : `Trả lời ${replyingTo?.from === 'me' ? 'chính bạn' : 'Minh Anh'}`}
              </strong>
              <small>
                {editing
                  ? editing.text
                  : replyingTo?.text || replyingTo?.file?.name || 'Hình ảnh'}
              </small>
            </span>
            <Button
              iconOnly
              aria-label="Đóng nội dung trích dẫn"
              onClick={() => {
                setReplyingTo(null);
                setEditing(null);
                if (editing) setDraft('');
              }}
            >
              ×
            </Button>
          </div>
        )}
        {emojiOpen && (
          <div className="emoji-picker">
            {['😀', '👍', '🎉', '❤️', '👏', '😊'].map((emoji) => (
              <Button
                key={emoji}
                iconOnly
                onClick={() => {
                  setDraft((value) => value + emoji);
                  setEmojiOpen(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
        <div className="composer">
          <Button
            iconOnly
            aria-label="Chọn biểu tượng cảm xúc"
            onClick={() => setEmojiOpen(!emojiOpen)}
          >
            <Icon name="smile" />
          </Button>
          <Button
            iconOnly
            aria-label="Đính kèm ảnh hoặc tệp"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="paperclip" />
          </Button>
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            onChange={(event) => {
              handleAttachment(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={editing ? 'Chỉnh sửa tin nhắn...' : 'Nhập tin nhắn...'}
            aria-label="Nội dung tin nhắn"
          />
          <Button
            iconOnly
            className="send-button"
            aria-label={editing ? 'Lưu chỉnh sửa' : 'Gửi tin nhắn'}
            onClick={send}
            disabled={!draft.trim()}
          >
            <Icon name="send" />
          </Button>
        </div>
        <p className="composer-hint hidden md:block">
          Nhấn Enter để gửi · Shift + Enter để xuống dòng
        </p>
      </footer>

      {selectedActionMessage && (
        <div className="sheet-backdrop md:hidden" onClick={() => setActionMessageId(null)}>
          <div className="action-sheet" onClick={(e) => e.stopPropagation()}>
            <span className="sheet-handle" />
            <p>Thao tác với tin nhắn</p>
            <MessageActions message={selectedActionMessage} sheet />
            <Button className="sheet-cancel" onClick={() => setActionMessageId(null)}>
              Hủy
            </Button>
          </div>
        </div>
      )}
      {viewerImage && (
        <div
          className="image-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh toàn màn hình"
        >
          <Button
            iconOnly
            className="viewer-close"
            aria-label="Đóng ảnh"
            onClick={() => setViewerImage(null)}
          >
            ×
          </Button>
          <img src={viewerImage} alt="Ảnh đính kèm toàn màn hình" />
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </section>
  );
}

export function MessengerPage({ onToggleList }: MessengerPageProps) {
  const [selected, setSelected] = useState(1);
  const [mobileChat, setMobileChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <ConversationList
        selected={selected}
        loading={loading}
        onSelect={(id) => {
          setSelected(id);
          setMobileChat(true);
        }}
      />
      <div className={mobileChat ? 'mobile-chat-open' : ''}>
        <ChatPanel onBack={() => setMobileChat(false)} onToggleList={onToggleList} />
      </div>
    </>
  );
}
