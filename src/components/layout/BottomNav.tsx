import { Icon } from '@/assets/icons';
import { IconName, AppView } from '@/types';
import { Button } from '@/components/common';

interface BottomNavProps {
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

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <Button
          key={item.label}
          className={activeView === item.view ? 'active' : ''}
          onClick={() => onViewChange(item.view)}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}
