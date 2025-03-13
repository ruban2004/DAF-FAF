import React, { useState, useRef } from "react";
import "./AudioRecorder.css";

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
    <div className="recorder-container">
      <button 
        className={`record-btn ${recording ? "stop" : "start"}`} 
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <div className="audio-controls">
          <audio ref={audioRef} controls src={audioURL}></audio>
          <a href={audioURL} download="recording.wav" className="download-btn">Download</a>

          {/* DAF Adjustment */}
          <div className="control-group">
            <label>DAF:</label>
            <button className="round-btn" onClick={() => setPlaybackRate(Math.max(0.5, playbackRate - 0.1))}>-</button>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={playbackRate}
              onChange={handleSpeedChange}
            />
            <button className="round-btn" onClick={() => setPlaybackRate(Math.min(2, playbackRate + 0.1))}>+</button>
            <span className="value-display">{(playbackRate * 100).toFixed(0)} ms</span>
          </div>

          {/* FAF Adjustment */}
          <div className="control-group">
            <label>FAF:</label>
            <button className="round-btn" onClick={() => setPitch(Math.max(0.5, pitch - 0.1))}>-</button>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={handlePitchChange}
            />
            <button className="round-btn" onClick={() => setPitch(Math.min(2, pitch + 0.1))}>+</button>
            <span className="value-display">{pitch.toFixed(1)}x</span>
          </div>
        </div>
      )}

      {/* Exercise Button */}
      <button className="exercise-btn">Start Exercise</button>
    </div>
  );
};

export default AudioRecorder;
