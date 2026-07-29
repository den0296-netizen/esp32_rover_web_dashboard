type VideoFeedProps = {
  src?: string;
};

function VideoFeed({ src }: VideoFeedProps) {
  return (
    <img
      className="video-stream"
      src={src}
      alt="Rover camera feed"
      style={{ width: 600, height: 400, background: 'rgba(181, 35, 35, 1)' }}
    />
  );
}

export default VideoFeed;
