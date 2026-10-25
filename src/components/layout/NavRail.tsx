import { Icon } from '@/assets/icons';
import { IconName, AppView } from '@/types';
import { Button } from '@/components/common';
import { Avatar } from '@/components/common';

interface NavRailProps {
  dark: boolean;
  onToggleDark: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

interface NavItem {
  icon: IconName;
  label: string;
  view: AppView;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'message', label: 'Tin nhắn', view: 'messages' },
  { icon: 'users', label: 'Danh bạ', view: 'contacts' },
  { icon: 'phone', label: 'Cuộc gọi', view: 'calls' },
  { icon: 'settings', label: 'Cá nhân', view: 'profile' },
];

export function NavRail({
  dark,
  onToggleDark,
  collapsed,
  onToggleCollapsed,
  activeView,
  onViewChange,
}: NavRailProps) {
  return (
    <aside className="nav-rail">
      <div className="brand-mark mb-6">
        <Icon name="message" />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Button
            key={item.label}
            className={`rail-item ${activeView === item.view ? 'active' : ''}`}
            title={item.label}
            onClick={() => onViewChange(item.view)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>
      <Button
        iconOnly
        className="hidden lg:flex xl:hidden"
        aria-label={collapsed ? 'Mở danh sách hội thoại' : 'Thu gọn danh sách hội thoại'}
        onClick={onToggleCollapsed}
      >
        <Icon name="panel" />
      </Button>
      <Button
        iconOnly
        aria-label={dark ? 'Bật giao diện sáng' : 'Bật giao diện tối'}
        onClick={onToggleDark}
      >
        <Icon name={dark ? 'sun' : 'moon'} />
      </Button>
      <Avatar name="Bảo Trân" size="sm" online />
    </aside>
  );
}
