import { useEffect, useState } from 'react';
import { AppView } from '@/types';
import { AuthScreen } from '@/pages/AuthScreen';
import { MessengerPage } from '@/pages/MessengerPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NavRail, BottomNav } from '@/components/layout';

function MessengerApp({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [activeView, setActiveView] = useState<AppView>('messages');
  const [listCollapsed, setListCollapsed] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <AuthScreen
        onAuthenticated={() => setAuthenticated(true)}
        dark={dark}
        onToggleDark={onToggleDark}
      />
    );
  }

  return (
    <main className={`app-shell ${listCollapsed ? 'list-collapsed' : ''}`}>
      <NavRail
        dark={dark}
        onToggleDark={onToggleDark}
        collapsed={listCollapsed}
        onToggleCollapsed={() => setListCollapsed(!listCollapsed)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Messages View */}
      {activeView === 'messages' && (
        <MessengerPage onToggleList={() => setListCollapsed(!listCollapsed)} />
      )}

      {/* Contacts View */}
      {activeView === 'contacts' && <ContactsPage />}

      {/* Calls View (Placeholder) */}
      {activeView === 'calls' && (
        <section className="conversation-panel">
          <header className="list-header">
            <div>
              <p className="eyebrow">Lịch sử</p>
              <h2 className="mt-1 text-xl font-bold">Cuộc gọi</h2>
            </div>
          </header>
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="empty-illustration inline-flex">
                <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold">Chưa có cuộc gọi nào</h3>
              <p className="mt-2 text-sm text-muted">
                Bắt đầu cuộc gọi thoại hoặc video với đồng nghiệp.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Profile View */}
      {activeView === 'profile' && (
        <ProfilePage dark={dark} onToggleDark={onToggleDark} onLogout={handleLogout} />
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </main>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return authenticated ? (
    <MessengerApp dark={dark} onToggleDark={() => setDark(!dark)} />
  ) : (
    <AuthScreen
      onAuthenticated={() => setAuthenticated(true)}
      dark={dark}
      onToggleDark={() => setDark(!dark)}
    />
  );
}
