import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VoiceRecognition = () => {
  const [message, setMessage] = useState("Listening...");
  const navigate = useNavigate();

  useEffect(() => {
    playAudioAndRecord();
  }, []);

  const playAudioAndRecord = () => {
    if (!window.speechSynthesis) {
      setMessage("Speech Synthesis not supported.");
      return;
    }

    // 🛑 Stop any ongoing speech to prevent double audio
    window.speechSynthesis.cancel();

    const text = "Can you hear this audio? Say only... yes.";
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = () => {
      setMessage("Listening for response...");
      startSpeechRecognition();
    };

    window.speechSynthesis.speak(speech);
  };

  const startSpeechRecognition = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setMessage("Speech Recognition not supported.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    setTimeout(() => {
      recognition.stop();
    }, 3000);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setMessage(`You said: "${transcript}"`);

      if (transcript.includes("yes")) {
        setTimeout(() => {
          navigate("/nextpage"); // Update the route as needed
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      setMessage(`Error: ${event.error}`);
      console.error("Speech Recognition Error:", event.error);
    };
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VoiceRecognition;
