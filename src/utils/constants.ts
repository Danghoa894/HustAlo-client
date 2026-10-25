import {
  Conversation,
  Message,
  Friend,
  FriendRequest,
  BlockedUser,
  User,
} from '@/types';

// Mock conversations
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Minh Anh',
    preview: 'Ok nhé, mình gửi ngay đây!',
    time: '10:42',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Nhóm Sản phẩm',
    preview: 'Tuấn: Bản mới đã sẵn sàng để xem',
    time: '10:18',
    unread: 5,
    typing: true,
    group: true,
  },
  {
    id: 3,
    name: 'Hoàng Nam',
    preview: 'Cuộc gọi thoại đã kết thúc',
    time: '09:35',
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: 'Dự án Phoenix',
    preview: 'Linh đã gửi một tệp',
    time: '08:51',
    unread: 12,
    group: true,
  },
  {
    id: 5,
    name: 'Thu Hà',
    preview: 'Hẹn gặp bạn ở phòng họp nhé',
    time: 'Hôm qua',
    unread: 0,
  },
  {
    id: 6,
    name: 'Quang Huy',
    preview: 'Cảm ơn bạn nhiều!',
    time: 'Hôm qua',
    unread: 0,
    online: true,
  },
  {
    id: 7,
    name: 'Ngọc Linh',
    preview: 'Hình ảnh',
    time: 'Thứ 3',
    unread: 0,
  },
  {
    id: 8,
    name: 'Đức Tuấn',
    preview: 'Mình đã cập nhật tài liệu rồi',
    time: 'Thứ 2',
    unread: 0,
  },
];

// Mock messages
export const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    from: 'other',
    text: 'Chào bạn, sáng nay mình trao đổi nhanh về kế hoạch ra mắt nhé?',
    time: '08:42',
    date: 'Hôm qua',
  },
  {
    id: 2,
    from: 'me',
    text: 'Được chứ. Mình vừa xem lại toàn bộ tài liệu.',
    time: '08:44',
    status: 'seen',
  },
  {
    id: 3,
    from: 'other',
    text: 'Tuyệt! Phần nội dung trang chủ đã chốt chưa?',
    time: '08:45',
  },
  {
    id: 4,
    from: 'me',
    text: 'Đã chốt bản tiếng Việt rồi. Chiều nay đội nội dung sẽ rà soát lần cuối.',
    time: '08:47',
    status: 'seen',
  },
  {
    id: 5,
    from: 'other',
    text: 'Mình gửi ảnh buổi làm việc hôm trước để bổ sung vào bài nhé.',
    time: '08:49',
  },
  {
    id: 6,
    from: 'other',
    image:
      'https://images.unsplash.com/photo-1640646291758-4f07d5fc1b58?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900',
    text: 'Ảnh này có ổn không?',
    time: '08:50',
  },
  {
    id: 7,
    from: 'me',
    text: 'Ảnh đẹp đó, không khí rất tự nhiên. Mình sẽ dùng cho phần văn hóa công ty.',
    time: '08:53',
    status: 'seen',
  },
  {
    id: 8,
    from: 'other',
    text: 'Ok bạn. Còn tài liệu hướng dẫn thì sao?',
    time: '08:55',
  },
  {
    id: 9,
    from: 'me',
    file: { name: 'Huong-dan-ra-mat-san-pham.pdf', size: '2,4 MB' },
    time: '08:58',
    status: 'seen',
  },
  {
    id: 10,
    from: 'me',
    text: 'Đây là bản mới nhất nhé.',
    time: '08:58',
    status: 'seen',
  },
];

// Mock friends
export const MOCK_FRIENDS: Friend[] = [
  { id: 1, name: 'Minh Anh', email: 'minhanh@hustalo.vn', online: true, status: 'friend' },
  { id: 2, name: 'Hoàng Nam', email: 'hoangnam@hustalo.vn', online: true, status: 'friend' },
  { id: 3, name: 'Thu Hà', email: 'thuha@hustalo.vn', online: false, status: 'friend' },
  { id: 4, name: 'Quang Huy', email: 'quanghuy@hustalo.vn', online: true, status: 'friend' },
  { id: 5, name: 'Ngọc Linh', email: 'ngoclinh@hustalo.vn', online: false, status: 'friend' },
  { id: 6, name: 'Đức Tuấn', email: 'ductuan@hustalo.vn', online: false, status: 'friend' },
  { id: 7, name: 'Phương Thảo', email: 'phuongthao@hustalo.vn', online: true, status: 'friend' },
  { id: 8, name: 'Việt Anh', email: 'vietanh@hustalo.vn', online: false, status: 'friend' },
];

// Mock friend requests received
export const MOCK_REQUESTS_RECEIVED: FriendRequest[] = [
  {
    id: 101,
    user: {
      id: 101,
      name: 'Thanh Tùng',
      email: 'thanhtung@hustalo.vn',
      online: true,
      status: 'pending-received',
    },
    createdAt: '2 giờ trước',
  },
  {
    id: 102,
    user: {
      id: 102,
      name: 'Khánh Linh',
      email: 'khanhlinh@hustalo.vn',
      online: false,
      status: 'pending-received',
    },
    createdAt: '1 ngày trước',
  },
];

// Mock friend requests sent
export const MOCK_REQUESTS_SENT: FriendRequest[] = [
  {
    id: 201,
    user: {
      id: 201,
      name: 'Mai Phương',
      email: 'maiphuong@hustalo.vn',
      online: false,
      status: 'pending-sent',
    },
    createdAt: '3 giờ trước',
  },
];

// Mock blocked users
export const MOCK_BLOCKED_USERS: BlockedUser[] = [
  {
    id: 301,
    name: 'Văn An',
    email: 'vanan@hustalo.vn',
    blockedAt: '1 tuần trước',
    status: 'blocked',
  },
];

// Mock search results (users not yet friends)
export const MOCK_SEARCH_USERS: User[] = [
  { id: 401, name: 'Hồng Nhung', email: 'hongnhung@hustalo.vn', online: true, status: 'none' },
  { id: 402, name: 'Tiến Dũng', email: 'tiendung@hustalo.vn', online: false, status: 'none' },
  { id: 403, name: 'Bảo Châu', email: 'baochau@hustalo.vn', online: true, status: 'none' },
];

// Avatar colors
export const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-600',
  'bg-indigo-500',
  'bg-orange-500',
];
