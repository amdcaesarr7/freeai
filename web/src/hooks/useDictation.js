import { useState } from 'react';

export function useDictation() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // We use MediaRecorder API
  const startDictation = async (onResult) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        try {
          if (window.puter) {
            // Using Puter's speech2txt
            const transcript = await window.puter.ai.speech2txt(audioBlob);
            onResult(transcript.text ?? transcript);
          } else {
            console.warn("Puter not available");
          }
        } catch (err) {
          console.error("Transcription failed", err);
        } finally {
          setIsTranscribing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      return () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setIsRecording(false);
      return null;
    }
  };

  return { isRecording, isTranscribing, startDictation };
}
