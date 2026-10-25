const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-600',
  'bg-indigo-500',
  'bg-orange-500',
];

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  online?: boolean;
  className?: string;
  src?: string;
}

export function Avatar({ name, size = 'md', online = false, className = '', src }: AvatarProps) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const initials = name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const sizes = {
    xs: 'size-5 text-[8px]',
    sm: 'size-9 text-xs',
    md: 'size-12 text-sm',
    lg: 'size-16 text-lg',
  };

  return (
    <span className={`avatar-wrap ${className}`}>
      {src ? (
        <img src={src} alt={name} className={`avatar ${sizes[size]} object-cover`} />
      ) : (
        <span className={`avatar ${color} ${sizes[size]}`}>{initials}</span>
      )}
      {online && <span className="online-dot" />}
    </span>
  );
}
