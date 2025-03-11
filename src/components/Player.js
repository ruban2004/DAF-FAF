function Player({ audioSrc }) {
  return (
    <div>
      <h2>Audio Player</h2>
      {audioSrc ? (
        <audio controls>
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No audio recorded yet.</p>
      )}
    </div>
  );
}

export default Player;
