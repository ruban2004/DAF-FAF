import React, { useState, useRef } from "react";

function Recorder({ setAudioUrl }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null); // ✅ Keep track of the stream

  const startRecording = async () => {
    console.log("🔴 Start Recording Clicked");
    try {
      // 🔹 Stop any existing stream before starting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // ✅ Store stream so it can be stopped later

      console.log("🎤 Microphone access granted");

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = []; // ✅ CLEAR previous audio chunks

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("🛑 Recording Stopped");

        if (audioChunksRef.current.length === 0) {
          console.warn("⚠️ No audio data recorded.");
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("🎵 New Audio URL:", audioUrl);

        setAudioUrl(audioUrl); // ✅ Replace previous recording in Player
      };

      mediaRecorder.start();
      console.log("✅ Recording Started");
      setRecording(true);
    } catch (error) {
      console.error("❌ Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    console.log("🛑 Stop Recording Clicked");

    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      // 🔹 Stop and reset the stream after stopping the recording
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    } else {
      console.warn("⚠️ No active recording to stop");
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>🎤 Start Recording</button>
      <button onClick={stopRecording} disabled={!recording}>🛑 Stop Recording</button>
    </div>
  );
}

export default Recorder;
