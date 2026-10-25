import { useState } from 'react';
import { Icon } from '@/assets/icons';
import { Button, Avatar } from '@/components/common';
import { ConfirmDialog } from '@/components/modals';
import { GroupMember } from '@/types';

interface ConversationInfoProps {
  isOpen: boolean;
  onClose: () => void;
  isGroup?: boolean;
  name: string;
  online?: boolean;
}

export function ConversationInfo({
  isOpen,
  onClose,
  isGroup = false,
  name,
  online = false,
}: ConversationInfoProps) {
  const [members] = useState<GroupMember[]>([
    { id: 1, name: 'Bảo Trân', email: 'baotran@hustalo.vn', online: true, role: 'owner' },
    { id: 2, name: 'Minh Anh', email: 'minhanh@hustalo.vn', online: true, role: 'member' },
    { id: 3, name: 'Hoàng Nam', email: 'hoangnam@hustalo.vn', online: false, role: 'member' },
    { id: 4, name: 'Thu Hà', email: 'thuha@hustalo.vn', online: false, role: 'member' },
  ]);

  const [sharedMedia] = useState([
    'https://images.unsplash.com/photo-1640646291758-4f07d5fc1b58?w=200',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200',
  ]);

  const [sharedFiles] = useState([
    { id: 1, name: 'Huong-dan-ra-mat-san-pham.pdf', size: '2,4 MB', date: '10/12/2026' },
    { id: 2, name: 'Ke-hoach-Q1-2027.xlsx', size: '1,8 MB', date: '05/12/2026' },
    { id: 3, name: 'Bao-cao-tien-do.docx', size: '856 KB', date: '28/11/2026' },
  ]);

  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupName, setGroupName] = useState(name);
  const [tempGroupName, setTempGroupName] = useState(name);

  const currentUser = members.find((m) => m.role === 'owner');
  const isOwner = currentUser?.role === 'owner';

  const handleRemoveMember = (member: GroupMember) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
    setMenuOpen(null);
  };

  const handleTransferOwnership = (member: GroupMember) => {
    console.log('Chuyển quyền trưởng nhóm cho:', member.name);
    setMenuOpen(null);
  };

  const handleLeaveGroup = () => {
    console.log('Rời khỏi nhóm');
    setLeaveDialogOpen(false);
    onClose();
  };

  const handleBlockUser = () => {
    console.log('Chặn người dùng');
    setBlockDialogOpen(false);
    onClose();
  };

  const handleSaveGroupName = () => {
    if (tempGroupName.trim().length > 0) {
      setGroupName(tempGroupName.trim());
      setIsEditingName(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <aside className="conversation-info-panel">
        <header className="info-header">
          <h2 className="text-lg font-bold">Thông tin</h2>
          <Button iconOnly aria-label="Đóng" onClick={onClose}>
            <Icon name="x" />
          </Button>
        </header>

        <div className="info-scroll">
          {/* Profile Section */}
          <div className="info-profile-section">
            <Avatar name={name} size="lg" online={!isGroup && online} />
            {isGroup && isEditingName ? (
              <div className="mt-4 w-full">
                <input
                  className="field-input text-center"
                  value={tempGroupName}
                  onChange={(e) => setTempGroupName(e.target.value)}
                  autoFocus
                  onBlur={handleSaveGroupName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveGroupName();
                    if (e.key === 'Escape') {
                      setTempGroupName(groupName);
                      setIsEditingName(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-4">
                <h3 className="text-xl font-bold">{groupName}</h3>
                {isGroup && isOwner && (
                  <Button
                    iconOnly
                    className="text-muted hover:text-primary"
                    aria-label="Đổi tên nhóm"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Icon name="edit" className="size-4" />
                  </Button>
                )}
              </div>
            )}
            {isGroup && (
              <p className="text-sm text-muted mt-1">{members.length} thành viên</p>
            )}
          </div>

          {/* Group Members */}
          {isGroup && (
            <div className="info-section">
              <div className="flex items-center justify-between mb-3">
                <h3 className="info-section-title">Thành viên</h3>
                {isOwner && (
                  <Button className="soft-button" iconOnly aria-label="Thêm thành viên">
                    <Icon name="user-plus" className="size-4" />
                  </Button>
                )}
              </div>
              <div className="members-list">
                {members.map((member) => (
                  <div key={member.id} className="member-item">
                    <Avatar name={member.name} size="sm" online={member.online} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{member.name}</p>
                        {member.role === 'owner' && (
                          <span className="owner-badge">
                            <Icon name="crown" className="size-3" />
                            Trưởng nhóm
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted truncate">{member.email}</p>
                    </div>
                    {isOwner && member.role !== 'owner' && (
                      <div className="relative">
                        <Button
                          iconOnly
                          aria-label="Tùy chọn"
                          onClick={() =>
                            setMenuOpen(menuOpen === member.id ? null : member.id)
                          }
                        >
                          <Icon name="more-vertical" className="size-4" />
                        </Button>
                        {menuOpen === member.id && (
                          <div className="member-menu">
                            <Button
                              className="menu-item"
                              onClick={() => handleTransferOwnership(member)}
                            >
                              <Icon name="crown" className="size-4" />
                              Chuyển quyền trưởng nhóm
                            </Button>
                            <Button
                              className="menu-item danger"
                              onClick={() => handleRemoveMember(member)}
                            >
                              <Icon name="user-minus" className="size-4" />
                              Xóa khỏi nhóm
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Media */}
          <div className="info-section">
            <h3 className="info-section-title">Ảnh & Video</h3>
            <div className="media-grid">
              {sharedMedia.map((src, index) => (
                <button key={index} className="media-item">
                  <img src={src} alt={`Ảnh ${index + 1}`} />
                </button>
              ))}
            </div>
            <Button className="text-button w-full mt-2">Xem tất cả</Button>
          </div>

          {/* Shared Files */}
          <div className="info-section">
            <h3 className="info-section-title">Tệp đính kèm</h3>
            <div className="files-list">
              {sharedFiles.map((file) => (
                <button key={file.id} className="file-item">
                  <div className="file-icon">
                    <Icon name="file" className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-semibold text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted">
                      {file.size} · {file.date}
                    </p>
                  </div>
                  <Icon name="chevron" className="size-4 text-muted" />
                </button>
              ))}
            </div>
            <Button className="text-button w-full mt-2">Xem tất cả</Button>
          </div>

          {/* Actions */}
          <div className="info-section">
            {isGroup ? (
              <Button
                className="danger-button w-full"
                onClick={() => setLeaveDialogOpen(true)}
              >
                <Icon name="log-out" className="size-5" />
                {isOwner ? 'Giải tán nhóm' : 'Rời khỏi nhóm'}
              </Button>
            ) : (
              <Button
                className="danger-button w-full"
                onClick={() => setBlockDialogOpen(true)}
              >
                <Icon name="shield-off" className="size-5" />
                Chặn người dùng
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={leaveDialogOpen}
        title={isOwner ? 'Giải tán nhóm' : 'Rời khỏi nhóm'}
        message={
          isOwner
            ? 'Bạn có chắc chắn muốn giải tán nhóm này? Tất cả thành viên sẽ bị xóa và dữ liệu không thể khôi phục.'
            : 'Bạn có chắc chắn muốn rời khỏi nhóm này? Bạn sẽ không thể xem tin nhắn của nhóm nữa.'
        }
        confirmText={isOwner ? 'Giải tán' : 'Rời khỏi'}
        cancelText="Hủy"
        variant="danger"
        onConfirm={handleLeaveGroup}
        onCancel={() => setLeaveDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={blockDialogOpen}
        title="Chặn người dùng"
        message={`Bạn có chắc chắn muốn chặn ${name}? Bạn sẽ không thể nhận tin nhắn hoặc cuộc gọi từ người này.`}
        confirmText="Chặn"
        cancelText="Hủy"
        variant="danger"
        onConfirm={handleBlockUser}
        onCancel={() => setBlockDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={removeDialogOpen}
        title="Xóa thành viên"
        message={`Bạn có chắc chắn muốn xóa ${selectedMember?.name} khỏi nhóm?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={() => {
          console.log('Đã xóa thành viên:', selectedMember?.name);
          setRemoveDialogOpen(false);
          setSelectedMember(null);
        }}
        onCancel={() => {
          setRemoveDialogOpen(false);
          setSelectedMember(null);
        }}
      />
    </>
  );
}
