import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';

function VideoFeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoFrame = useAppStore((state) => state.videoFrame);

  useEffect(() => {
    if (!videoFrame || !canvasRef.current) {
      return;
    }

    let cancelled = false;

    const renderFrame = async () => {
      const bitmap = await createImageBitmap(videoFrame);

      if (cancelled || !canvasRef.current) {
        bitmap.close();
        return;
      }

      const canvas = canvasRef.current;
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
      bitmap.close();
    };

    void renderFrame().catch((error: unknown) => {
      console.error('Failed to render video frame:', error);
    });

    return () => {
      cancelled = true;
    };
  }, [videoFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="video-stream"
      aria-label="Rover camera feed"
      style={{ width: 600, height: 400, background: 'rgba(181, 35, 35, 1)' }}
    />
  );
}

export default VideoFeed;
