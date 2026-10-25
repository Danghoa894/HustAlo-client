import { ChangeEvent, FormEvent, useState } from 'react';
import { Icon } from '@/assets/icons';
import { Button, Avatar } from '@/components/common';
import { ConfirmDialog } from '@/components/modals';

interface ProfilePageProps {
  dark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
}

export function ProfilePage({ dark, onToggleDark, onLogout }: ProfilePageProps) {
  const [displayName, setDisplayName] = useState('Bảo Trân');
  const [email] = useState('baotran@hustalo.vn');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setAvatarError('Chỉ hỗ trợ định dạng JPG và PNG');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Kích thước ảnh tối đa 2 MB');
      return;
    }

    // Preview avatar
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (tempDisplayName.trim().length < 2) return;

    setDisplayName(tempDisplayName.trim());
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCancel = () => {
    setTempDisplayName(displayName);
    setIsEditing(false);
  };

  return (
    <section className="profile-page">
      <header className="list-header">
        <div>
          <p className="eyebrow">Tài khoản</p>
          <h2 className="mt-1 text-xl font-bold">Cá nhân & Cài đặt</h2>
        </div>
      </header>

      <div className="profile-scroll">
        {/* Profile Section */}
        <div className="profile-section">
          <h3 className="section-header">Thông tin cá nhân</h3>

          <div className="profile-card">
            {/* Avatar */}
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrap">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="profile-avatar-image"
                  />
                ) : (
                  <Avatar name={displayName} size="lg" />
                )}
                <label className="profile-avatar-button">
                  <Icon name="camera" className="size-5" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">Ảnh đại diện</p>
                <p className="text-xs text-muted mt-1">
                  JPG hoặc PNG, tối đa 2 MB
                </p>
                {avatarError && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    {avatarError}
                  </p>
                )}
              </div>
            </div>

            {/* Display Name */}
            <div className="profile-field-group">
              <label className="field-label">
                Tên hiển thị
                {!isEditing ? (
                  <div className="profile-field-readonly">
                    <span>{displayName}</span>
                    <Button
                      iconOnly
                      className="edit-button"
                      aria-label="Chỉnh sửa tên"
                      onClick={() => setIsEditing(true)}
                    >
                      <Icon name="edit" className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSave}>
                    <input
                      className="field-input"
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      placeholder="Nhập tên hiển thị"
                      autoFocus
                    />
                    <div className="profile-field-actions">
                      <Button type="button" onClick={handleCancel}>
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        className="primary-button"
                        disabled={tempDisplayName.trim().length < 2}
                      >
                        Lưu
                      </Button>
                    </div>
                  </form>
                )}
              </label>
            </div>

            {/* Email (Read-only) */}
            <div className="profile-field-group">
              <label className="field-label">
                Email công ty
                <div className="profile-field-readonly">
                  <span>{email}</span>
                  <span className="readonly-badge">Chỉ đọc</span>
                </div>
              </label>
            </div>

            {saveSuccess && (
              <div className="success-message">
                <Icon name="check" className="size-4" />
                Đã lưu thay đổi
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="profile-section">
          <h3 className="section-header">Cài đặt</h3>

          <div className="settings-card">
            {/* Dark Mode Toggle */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Icon name={dark ? 'moon' : 'sun'} className="size-5" />
                </div>
                <div>
                  <p className="setting-title">Giao diện tối</p>
                  <p className="setting-description">
                    Chuyển sang chế độ tối để giảm mỏi mắt
                  </p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={dark}
                  onChange={onToggleDark}
                  className="toggle-input"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Notifications Toggle */}
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Icon name="bell" className="size-5" />
                </div>
                <div>
                  <p className="setting-title">Thông báo</p>
                  <p className="setting-description">
                    Nhận thông báo về tin nhắn và cuộc gọi mới
                  </p>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="toggle-input"
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="profile-section">
          <h3 className="section-header">Tài khoản</h3>

          <div className="account-actions-card">
            <Button
              className="account-action-button danger"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <Icon name="log-out" className="size-5" />
              <div className="text-left flex-1">
                <p className="font-semibold">Đăng xuất</p>
                <p className="text-xs opacity-80 mt-0.5">
                  Thoát khỏi tài khoản hiện tại
                </p>
              </div>
              <Icon name="chevron" className="size-4" />
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="profile-section">
          <div className="app-info">
            <div className="brand">
              <span className="brand-mark">
                <Icon name="message" />
              </span>
              HustAlo
            </div>
            <p className="text-xs text-muted mt-2">Phiên bản 1.0.0</p>
            <p className="text-xs text-muted mt-1">
              © 2026 HustAlo. Dành cho nội bộ.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutDialogOpen}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        variant="danger"
        onConfirm={onLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </section>
  );
}
