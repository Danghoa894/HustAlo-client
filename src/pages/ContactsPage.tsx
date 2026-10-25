import { useMemo, useState } from 'react';
import { Icon } from '@/assets/icons';
import { Button, Avatar, SearchBox, EmptyState } from '@/components/common';
import { ContactsTab, Friend, FriendRequest, BlockedUser, User } from '@/types';
import {
  MOCK_FRIENDS,
  MOCK_REQUESTS_RECEIVED,
  MOCK_REQUESTS_SENT,
  MOCK_BLOCKED_USERS,
  MOCK_SEARCH_USERS,
} from '@/utils/constants';

export function ContactsPage() {
  const [activeTab, setActiveTab] = useState<ContactsTab>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [requestsReceived, setRequestsReceived] =
    useState<FriendRequest[]>(MOCK_REQUESTS_RECEIVED);
  const [requestsSent, setRequestsSent] = useState<FriendRequest[]>(MOCK_REQUESTS_SENT);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(MOCK_BLOCKED_USERS);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Tìm kiếm users
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (activeTab === 'friends' && query.trim().length > 0) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = MOCK_SEARCH_USERS.filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Lọc danh sách dựa trên search query
  const filteredFriends = useMemo(
    () =>
      friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [friends, searchQuery]
  );

  const filteredReceived = useMemo(
    () =>
      requestsReceived.filter(
        (req) =>
          req.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [requestsReceived, searchQuery]
  );

  const filteredSent = useMemo(
    () =>
      requestsSent.filter(
        (req) =>
          req.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [requestsSent, searchQuery]
  );

  const filteredBlocked = useMemo(
    () =>
      blockedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [blockedUsers, searchQuery]
  );

  // Actions
  const handleSendRequest = (userId: number) => {
    console.log('Gửi lời mời kết bạn:', userId);
    // Cập nhật UI
    setSearchResults((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: 'pending-sent' } : user
      )
    );
  };

  const handleCancelRequest = (requestId: number) => {
    setRequestsSent((prev) => prev.filter((req) => req.id !== requestId));
  };

  const handleAcceptRequest = (request: FriendRequest) => {
    setRequestsReceived((prev) => prev.filter((req) => req.id !== request.id));
    setFriends((prev) => [...prev, { ...request.user, status: 'friend' }]);
  };

  const handleDeclineRequest = (requestId: number) => {
    setRequestsReceived((prev) => prev.filter((req) => req.id !== requestId));
  };

  const handleUnblock = (userId: number) => {
    setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleBlock = (userId: number) => {
    const friend = friends.find((f) => f.id === userId);
    if (friend) {
      setFriends((prev) => prev.filter((f) => f.id !== userId));
      setBlockedUsers((prev) => [
        ...prev,
        {
          ...friend,
          status: 'blocked',
          blockedAt: 'Vừa xong',
        },
      ]);
    }
    setMenuOpen(null);
  };

  const handleRemoveFriend = (userId: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== userId));
    setMenuOpen(null);
  };

  const tabs: { id: ContactsTab; label: string; count: number }[] = [
    { id: 'friends', label: 'Bạn bè', count: friends.length },
    { id: 'received', label: 'Lời mời đã nhận', count: requestsReceived.length },
    { id: 'sent', label: 'Lời mời đã gửi', count: requestsSent.length },
    { id: 'blocked', label: 'Đã chặn', count: blockedUsers.length },
  ];

  return (
    <section className="contacts-page">
      <header className="list-header">
        <div>
          <p className="eyebrow">Kết nối</p>
          <h2 className="mt-1 text-xl font-bold">Danh bạ</h2>
        </div>

        <SearchBox
          value={searchQuery}
          onChange={handleSearch}
          placeholder={
            activeTab === 'friends'
              ? 'Tìm bạn bè hoặc tìm người dùng'
              : 'Tìm kiếm'
          }
          className="mt-5"
        />
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            {tab.label}
            {tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="contacts-scroll">
        {/* Tab: Bạn bè */}
        {activeTab === 'friends' && (
          <>
            {/* Kết quả tìm kiếm người dùng mới */}
            {searchQuery.trim().length > 0 && searchResults.length > 0 && (
              <div className="search-results-section">
                <h3 className="section-title">Kết quả tìm kiếm</h3>
                {searchResults.map((user) => (
                  <div key={user.id} className="contact-item">
                    <Avatar name={user.name} size="md" online={user.online} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    {user.status === 'none' && (
                      <Button
                        className="contact-action-button"
                        onClick={() => handleSendRequest(user.id)}
                      >
                        <Icon name="user-plus" className="size-4" />
                        Kết bạn
                      </Button>
                    )}
                    {user.status === 'pending-sent' && (
                      <Button className="contact-action-button secondary" disabled>
                        <Icon name="clock" className="size-4" />
                        Đã gửi lời mời
                      </Button>
                    )}
                    {user.status === 'friend' && (
                      <Button className="contact-action-button primary">
                        <Icon name="message" className="size-4" />
                        Nhắn tin
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Danh sách bạn bè */}
            {filteredFriends.length > 0 ? (
              <div className="friends-section">
                {searchQuery.trim().length > 0 && searchResults.length > 0 && (
                  <h3 className="section-title">Bạn bè của bạn</h3>
                )}
                {filteredFriends.map((friend) => (
                  <div key={friend.id} className="contact-item">
                    <Avatar name={friend.name} size="md" online={friend.online} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{friend.name}</p>
                      <p className="text-xs text-muted truncate">{friend.email}</p>
                    </div>
                    <div className="contact-actions">
                      <Button
                        iconOnly
                        aria-label="Nhắn tin"
                        title="Nhắn tin"
                        className="contact-icon-button"
                      >
                        <Icon name="message" className="size-4" />
                      </Button>
                      <Button
                        iconOnly
                        aria-label="Gọi thoại"
                        title="Gọi thoại"
                        className="contact-icon-button"
                      >
                        <Icon name="phone" className="size-4" />
                      </Button>
                      <Button
                        iconOnly
                        aria-label="Gọi video"
                        title="Gọi video"
                        className="contact-icon-button"
                      >
                        <Icon name="video" className="size-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          iconOnly
                          aria-label="Thêm tùy chọn"
                          className="contact-icon-button"
                          onClick={() =>
                            setMenuOpen(menuOpen === friend.id ? null : friend.id)
                          }
                        >
                          <Icon name="more-vertical" className="size-4" />
                        </Button>
                        {menuOpen === friend.id && (
                          <div className="contact-menu">
                            <Button
                              className="menu-item"
                              onClick={() => handleRemoveFriend(friend.id)}
                            >
                              <Icon name="user-minus" className="size-4" />
                              Xóa bạn bè
                            </Button>
                            <Button
                              className="menu-item danger"
                              onClick={() => handleBlock(friend.id)}
                            >
                              <Icon name="shield-off" className="size-4" />
                              Chặn
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isSearching &&
              searchQuery.trim().length === 0 && (
                <EmptyState
                  icon="users"
                  title="Chưa có bạn bè"
                  description="Tìm kiếm và kết nối với đồng nghiệp của bạn."
                  action={
                    <Button className="primary-button">
                      <Icon name="user-plus" className="size-4" />
                      Tìm bạn bè
                    </Button>
                  }
                />
              )
            )}
          </>
        )}

        {/* Tab: Lời mời đã nhận */}
        {activeTab === 'received' && (
          <>
            {filteredReceived.length > 0 ? (
              filteredReceived.map((request) => (
                <div key={request.id} className="contact-item">
                  <Avatar
                    name={request.user.name}
                    size="md"
                    online={request.user.online}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{request.user.name}</p>
                    <p className="text-xs text-muted truncate">{request.user.email}</p>
                    <p className="text-xs text-muted mt-1">{request.createdAt}</p>
                  </div>
                  <div className="contact-request-actions">
                    <Button
                      className="contact-action-button primary"
                      onClick={() => handleAcceptRequest(request)}
                    >
                      <Icon name="user-check" className="size-4" />
                      Chấp nhận
                    </Button>
                    <Button
                      className="contact-action-button"
                      onClick={() => handleDeclineRequest(request.id)}
                    >
                      <Icon name="user-x" className="size-4" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon="user-check"
                title="Không có lời mời kết bạn"
                description="Bạn chưa nhận được lời mời kết bạn nào."
              />
            )}
          </>
        )}

        {/* Tab: Lời mời đã gửi */}
        {activeTab === 'sent' && (
          <>
            {filteredSent.length > 0 ? (
              filteredSent.map((request) => (
                <div key={request.id} className="contact-item">
                  <Avatar
                    name={request.user.name}
                    size="md"
                    online={request.user.online}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{request.user.name}</p>
                    <p className="text-xs text-muted truncate">{request.user.email}</p>
                    <p className="text-xs text-muted mt-1">
                      Đã gửi {request.createdAt}
                    </p>
                  </div>
                  <Button
                    className="contact-action-button"
                    onClick={() => handleCancelRequest(request.id)}
                  >
                    <Icon name="x" className="size-4" />
                    Hủy lời mời
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState
                icon="user-plus"
                title="Chưa gửi lời mời nào"
                description="Tìm kiếm và gửi lời mời kết bạn cho đồng nghiệp."
              />
            )}
          </>
        )}

        {/* Tab: Đã chặn */}
        {activeTab === 'blocked' && (
          <>
            {filteredBlocked.length > 0 ? (
              filteredBlocked.map((user) => (
                <div key={user.id} className="contact-item">
                  <Avatar name={user.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                    <p className="text-xs text-muted mt-1">Đã chặn {user.blockedAt}</p>
                  </div>
                  <Button
                    className="contact-action-button"
                    onClick={() => handleUnblock(user.id)}
                  >
                    <Icon name="user-check" className="size-4" />
                    Bỏ chặn
                  </Button>
                </div>
              ))
            ) : (
              <EmptyState
                icon="shield-off"
                title="Không có người dùng bị chặn"
                description="Bạn chưa chặn ai."
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
