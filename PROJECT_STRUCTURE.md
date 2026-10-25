# HustAlo - Cấu trúc dự án

## 📁 Cấu trúc thư mục

```
src/
├── assets/              # Icons và assets tĩnh
│   └── icons.tsx       # Icon component với 38+ icons
│
├── components/          # Các React components
│   ├── common/         # Common reusable components
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── SearchBox.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts
│   │
│   ├── layout/         # Layout components
│   │   ├── NavRail.tsx      # Desktop sidebar navigation
│   │   ├── BottomNav.tsx    # Mobile bottom navigation
│   │   └── index.ts
│   │
│   ├── modals/         # Modal components
│   │   ├── CreateGroupModal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── ImageViewer.tsx
│   │   └── index.ts
│   │
│   └── ConversationInfo.tsx  # Info panel cho conversation
│
├── hooks/              # Custom React hooks (sẵn sàng mở rộng)
│
├── pages/              # Page components
│   ├── AuthScreen.tsx       # Đăng nhập / Đăng ký
│   ├── MessengerPage.tsx    # Tin nhắn (ConversationList + ChatPanel)
│   ├── ContactsPage.tsx     # Danh bạ với tabs
│   ├── ProfilePage.tsx      # Cá nhân & Cài đặt
│   └── index.ts
│
├── types/              # TypeScript type definitions
│   └── index.ts        # All types: IconName, User, Friend, Message, etc.
│
├── utils/              # Utility functions và constants
│   └── constants.ts    # Mock data: conversations, messages, friends, etc.
│
├── App.tsx             # Root component với routing logic
├── main.tsx            # React entry point
└── index.css           # Global styles + Tailwind CSS v4
```

## 🎨 Pages & Features

### 1. **AuthScreen** (`pages/AuthScreen.tsx`)
- Đăng nhập / Đăng ký
- Form validation
- Demo account: `demo@hustalo.vn` / `hustalo123`
- Dark mode toggle
- Responsive layout (split screen desktop, single column mobile)

### 2. **MessengerPage** (`pages/MessengerPage.tsx`)
**ConversationList:**
- Danh sách hội thoại với preview
- Search conversations
- Loading skeleton
- Unread badges, typing indicator
- Empty state

**ChatPanel:**
- Tin nhắn với reply, edit, recall
- Upload file/image (max 10MB ảnh, 25MB file)
- Emoji picker
- Search trong conversation
- Message status (sending, sent, delivered, seen)
- Long press menu trên mobile
- Image viewer fullscreen

### 3. **ContactsPage** (`pages/ContactsPage.tsx`)
**4 Tabs:**
- **Bạn bè**: Danh sách bạn bè với menu (Nhắn tin, Gọi, Xóa bạn, Chặn)
- **Lời mời đã nhận**: Chấp nhận / Từ chối
- **Lời mời đã gửi**: Hủy lời mời
- **Đã chặn**: Bỏ chặn

**Features:**
- Tìm kiếm users theo tên hoặc email
- Gửi lời mời kết bạn
- Empty states cho từng tab

### 4. **ProfilePage** (`pages/ProfilePage.tsx`)
- Upload avatar (JPG/PNG, max 2MB với validation)
- Edit display name
- Email read-only
- Dark mode toggle
- Notification toggle
- Logout button với confirmation dialog

### 5. **ConversationInfo** (`components/ConversationInfo.tsx`)
**Group Info:**
- Member list với "Trưởng nhóm" badge
- Add/Remove member (owner only)
- Transfer ownership (owner only)
- Rename group (owner only)
- Leave group / Dissolve group

**Direct Chat Info:**
- Profile
- Shared media grid (ảnh & video)
- Shared files list
- Block user

## 🧩 Components

### Common Components
- **Button**: Base button với variants (primary, danger, icon-only, etc.)
- **Avatar**: Avatar component với colors, sizes, online status
- **SearchBox**: Search input với keyboard shortcut display
- **EmptyState**: Empty state UI với icon, title, description, action

### Layout Components
- **NavRail**: Desktop sidebar navigation với dark mode toggle
- **BottomNav**: Mobile bottom navigation

### Modals
- **CreateGroupModal**: Tạo nhóm với tên, avatar (optional), chọn 2-49 members
- **ConfirmDialog**: Reusable confirmation dialog (default/danger variants)
- **ImageViewer**: Fullscreen image viewer

## 📦 Types (`types/index.ts`)

```typescript
// Main types
IconName          // 38+ icon names
AppView           // 'messages' | 'contacts' | 'calls' | 'profile'
ContactsTab       // 'friends' | 'received' | 'sent' | 'blocked'
FriendStatus      // 'friend' | 'pending-sent' | 'pending-received' | 'blocked' | 'none'
MessageStatus     // 'sending' | 'sent' | 'delivered' | 'seen'

// Interfaces
User              // id, name, email, avatar, online, status
Friend            // extends User với status: 'friend'
FriendRequest     // id, user, createdAt
BlockedUser       // extends User với blockedAt
Message           // id, from, text, time, status, image, file, replyTo, edited, recalled
Conversation      // id, name, preview, time, unread, typing, online, group, members
GroupMember       // extends User với role: 'owner' | 'member'
```

## 🎨 Styling

- **Tailwind CSS v4** qua `@tailwindcss/vite` plugin
- Global styles trong `src/index.css`
- CSS Variables cho theming (light/dark mode)
- Responsive breakpoints: mobile-first
  - `md`: 768px (tablet)
  - `lg`: 1024px (desktop)
  - `xl`: 1280px (large desktop)

## 🔧 Configuration

- **Path alias**: `@/` → `src/`
- Đã config trong `vite.config.ts` và `tsconfig.json`
- Import example: `import { Icon } from '@/assets/icons'`

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start dev server (đã chạy sẵn trong Figma Make)
# Preview: http://localhost:8443

# Format code
pnpm format
```

## 📝 Mock Data (`utils/constants.ts`)

- `MOCK_CONVERSATIONS`: 8 conversations
- `MOCK_MESSAGES`: 10 messages với various types
- `MOCK_FRIENDS`: 8 friends
- `MOCK_REQUESTS_RECEIVED`: 2 pending requests
- `MOCK_REQUESTS_SENT`: 1 sent request
- `MOCK_BLOCKED_USERS`: 1 blocked user
- `MOCK_SEARCH_USERS`: 3 searchable users
- `AVATAR_COLORS`: 8 color variants

## 🎯 Key Features

✅ Responsive design (mobile-first)
✅ Dark mode support
✅ TypeScript strict mode
✅ Component-based architecture
✅ Path alias configured
✅ Reusable components
✅ Mock data ready
✅ Form validation
✅ File upload với validation
✅ Confirm dialogs
✅ Empty states
✅ Loading skeletons
✅ Toast notifications
✅ Image viewer
✅ Search functionality

## 📚 Next Steps

Để mở rộng dự án:

1. **Redux/Zustand**: Tạo store trong `src/store/` hoặc `src/redux/`
2. **API Integration**: Tạo services trong `src/services/` hoặc `src/api/`
3. **Custom Hooks**: Thêm hooks trong `src/hooks/` (useAuth, useChat, etc.)
4. **Utils**: Thêm helper functions trong `src/utils/`
5. **Tests**: Tạo `__tests__/` folders
6. **Routing**: Cân nhắc React Router nếu cần deep linking

---

**Version**: 1.0.0  
**Last Updated**: October 5, 2026  
**Tech Stack**: React 19 + TypeScript + Tailwind CSS v4 + Vite 8
