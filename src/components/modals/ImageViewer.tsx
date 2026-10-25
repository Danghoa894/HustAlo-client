import { Icon } from '@/assets/icons';
import { Button } from '@/components/common';

interface ImageViewerProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export function ImageViewer({ src, alt = 'Ảnh đính kèm toàn màn hình', onClose }: ImageViewerProps) {
  if (!src) return null;

  return (
    <div
      className="image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh toàn màn hình"
      onClick={onClose}
    >
      <Button
        iconOnly
        className="viewer-close"
        aria-label="Đóng ảnh"
        onClick={onClose}
      >
        ×
      </Button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
