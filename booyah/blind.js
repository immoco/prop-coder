// src/components/Conversation.js
import React, { useState, useEffect, useRef } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { Container } from "react-bootstrap";

const Conversation = () => {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const recognitionRef = useRef(null);

  // ✅ Initialize Speech Recognition (Continuous Mode)
  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true; // Always listen
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("User said:", transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onend = () => {
      console.warn("Speech recognition stopped. Restarting...");
      recognition.start(); // Automatically restart if stopped
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      speakText("I had trouble understanding you. Please try again.");
      recognition.start(); // Keep listening on error
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

  // ✅ Fetch Lessons from Firestore
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
        console.log("Fetched Lessons:", lessonList);

        // Welcome message
        console.log('error here');
        speakText("Welcome to English learning. Say 'Next' to begin.", () => {
          startListening(); // Start listening after speech
          console.log('error here0');

        });

        console.log('error here1');

      } catch (error) {
        console.error("Error fetching lessons:", error);
        speakText("Error loading lessons. Please try again later.");
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

  // ✅ Handle Voice Commands
  const handleVoiceCommand = (command) => {
    if (command.includes("next")) {
      nextLesson();
    } else if (command.includes("repeat")) {
      repeatLesson();
    } else if (command.includes("exit")) {
      speakText("Goodbye!");
      if (recognitionRef.current) recognitionRef.current.stop();
    } else {
      speakText("I didn't understand. Say 'Next', 'Repeat', or 'Exit'.");
    }
  };

  // ✅ Move to the Next Lesson
  const nextLesson = () => {
    if (currentLesson < lessons.length) {
      const { question } = lessons[currentLesson];
      speakText(question);
      setCurrentLesson(currentLesson + 1);
    } else {
      speakText("You have completed all lessons. Say 'Exit' to finish.");
    }
  };

  // ✅ Repeat Current Lesson
  const repeatLesson = () => {
    if (currentLesson > 0) {
      const { question } = lessons[currentLesson - 1];
      speakText(`Repeating: ${question}`);
    } else {
      speakText("No lesson to repeat. Say 'Next' to begin.");
    }
  };

  return (
    <Container className="text-center mt-5">
      <h1>English Learning for the Blind</h1>
      <p>The system is always listening for your voice.</p>
      <p>Say "Next" to proceed, "Repeat" to hear again, or "Exit" to quit.</p>
    </Container>
  );
};

export default Conversation;
