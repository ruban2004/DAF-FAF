import React, { useState, useRef, useEffect } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      // Reset previous recording
      setAudioURL(null);
      audioChunks.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  };

  const handleSpeedChange = (event) => {
    const speed = parseFloat(event.target.value);
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handlePitchChange = (event) => {
    const pitchValue = parseFloat(event.target.value);
    setPitch(pitchValue);
    if (audioRef.current) {
      audioRef.current.preservesPitch = false;
      audioRef.current.playbackRate = pitchValue;
    }
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <div>
          <audio ref={audioRef} controls src={audioURL}></audio>
          <a href={audioURL} download="recording.wav">Download</a>
          <div>
            <label>DAF: </label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={playbackRate * 100}
              onChange={(e) => handleSpeedChange({ target: { value: e.target.value / 100 } })}
            />
            <span>{playbackRate * 100} ms</span>
          </div>
          <div>
            <label>FAF: </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={handlePitchChange}
            />
            <span>{pitch}x</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
