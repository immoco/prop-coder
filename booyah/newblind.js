import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

const VoiceRecognition = () => {
  const [message, setMessage] = useState("Listening...");
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Initialize Speech Recognition (Continuous Mode)
  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false; // Change to false for single command
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("User said:", transcript);
      setMessage(`You said: "${transcript}"`);

      if (transcript.includes("yes")) {
        setTimeout(() => {
          navigate("/nextpage"); // Change route as needed
        }, 1000);
      } else {
        speakText("I didn't understand. Say 'Yes' to proceed.");
        recognition.start(); // Restart recognition
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      speakText("I had trouble understanding you. Please try again.");
      recognition.start(); // Restart on error
    };

    return recognition;
  };

  // ✅ Start Listening Automatically
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // ✅ Speech Synthesis (Text-to-Speech)
  const speakText = (text, onEnd) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.onend = () => {
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(speech);
  };

  // ✅ Fetch Lessons from Firestore (If needed)
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonsCollection = collection(db, "videos");
        const lessonSnapshot = await getDocs(lessonsCollection);
        const lessonList = lessonSnapshot.docs.map((doc) => doc.data());

        if (lessonList.length === 0) {
          speakText("No lessons available.");
          return;
        }

        setLessons(lessonList);
        speakText("Welcome! Say 'Yes' to continue.", startListening);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        speakText("Error loading lessons. Please try again.");
      }
    };

    // Initialize and Start
    recognitionRef.current = initializeRecognition();
    fetchLessons();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Voice Recognition</h1>
      <h2>{message}</h2>
      <p>Say "Yes" to proceed.</p>
    </div>
  );
};

export default VoiceRecognition;
