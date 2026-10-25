import { FormEvent, useState, useMemo, ChangeEvent } from 'react';
import { Icon } from '@/assets/icons';
import { Button, Avatar, SearchBox } from '@/components/common';
import { Friend } from '@/types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  onCreate: (name: string, members: number[]) => void;
}

export function CreateGroupModal({ isOpen, onClose, friends, onCreate }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const filteredFriends = useMemo(
    () =>
      friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [friends, searchQuery]
  );

  const toggleMember = (id: number) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedMembers(newSelection);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa 2 MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Chỉ hỗ trợ định dạng JPG và PNG');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && selectedMembers.size >= 2) {
      onCreate(groupName.trim(), Array.from(selectedMembers));
      handleClose();
    }
  };

  const handleClose = () => {
    setGroupName('');
    setSearchQuery('');
    setSelectedMembers(new Set());
    setAvatarPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  const isValid = groupName.trim().length > 0 && selectedMembers.size >= 2 && selectedMembers.size <= 49;

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content create-group-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>Tạo nhóm mới</h2>
          <Button iconOnly aria-label="Đóng" onClick={handleClose}>
            <Icon name="x" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="group-avatar-section">
            <label className="group-avatar-upload">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Group avatar" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <Icon name="camera" className="size-6" />
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </label>
            <p className="text-sm text-muted">
              Ảnh đại diện nhóm (tùy chọn)
              <br />
              <small>JPG hoặc PNG, tối đa 2 MB</small>
            </p>
          </div>

          <label className="field-label">
            Tên nhóm
            <input
              className="field-input"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm"
              autoFocus
            />
          </label>

          <div className="member-selection-section">
            <div className="flex items-center justify-between">
              <label className="field-label mb-0">Chọn thành viên</label>
              <span className="text-sm font-semibold text-muted">
                Đã chọn {selectedMembers.size} người{' '}
                <small className="font-normal">
                  (tối thiểu 2, tối đa 49)
                </small>
              </span>
            </div>

            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Tìm bạn bè"
              showKeyboardShortcut={false}
              className="mt-3"
            />

            <div className="member-list">
              {filteredFriends.length === 0 ? (
                <p className="empty-message">Không tìm thấy bạn bè nào</p>
              ) : (
                filteredFriends.map((friend) => (
                  <label key={friend.id} className="member-item">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(friend.id)}
                        onChange={() => toggleMember(friend.id)}
                        disabled={
                          !selectedMembers.has(friend.id) && selectedMembers.size >= 49
                        }
                        className="checkbox"
                      />
                      <Avatar name={friend.name} size="sm" online={friend.online} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{friend.name}</p>
                        <p className="text-xs text-muted truncate">{friend.email}</p>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </form>

        <footer className="modal-footer">
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            className="primary-button"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Tạo nhóm
          </Button>
        </footer>
      </div>
    </div>
  );
}
