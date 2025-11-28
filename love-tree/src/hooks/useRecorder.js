// FILE: src/hooks/useRecorder.js
import { useState, useRef } from 'react';

export default function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const dataRef = useRef([]);
  const intervalRef = useRef(null);

  async function start() {
    if (!navigator.mediaDevices) throw new Error('摄像头/麦克风不可用');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    dataRef.current = [];

    mediaRecorderRef.current.ondataavailable = e => dataRef.current.push(e.data);
    mediaRecorderRef.current.start();
    setRecording(true);
    setSeconds(0);

    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function stop() {
    return new Promise(resolve => {
      if (!mediaRecorderRef.current) return resolve(null);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(dataRef.current, { type: 'audio/webm' });
        clearInterval(intervalRef.current);
        setRecording(false);
        setSeconds(0);
        resolve(blob);
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
    });
  }

  return {
    recording, seconds, start, stop
  };
}
