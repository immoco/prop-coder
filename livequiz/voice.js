import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Loader1 from './loader.js'; // Import Loader Component

const SpeechAssistant = () => {
    const recognitionRef = useRef(null); 
    const speechTimeoutRef = useRef(null); 
    const isListening = useRef(false); 
    const lastInputRef = useRef(""); // Track last processed input

    const speakText = (text) => {
        if (!text.trim()) return;

        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1;

        utterance.onstart = () => {
            console.log("🔊 Speaking:", text);
            recognitionRef.current?.stop(); // Stop recognition while speaking
            isListening.current = false; // Prevent immediate restart
        };

        utterance.onend = () => {
            console.log("✅ Done speaking");
            setTimeout(() => {
                if (!window.speechSynthesis.speaking) {
                    startListening(); // Restart only when speech fully ends
                }
            }, 2000); // 2-second delay before listening again
        };

        window.speechSynthesis.speak(utterance);
    };

    // Send user input to Gemini API
    const sendPromptToGemini = useCallback(async (text) => {
        try {
            if (text.trim() === "" || text === lastInputRef.current) return; // Ignore empty/repeated inputs
            lastInputRef.current = text; // Store last spoken phrase

            console.log("🚀 Sending to Gemini:", text);
            const res = await axios.post("http://localhost:3001/gemini-response", { userText: text });
            const aiResponse = res.data.reply || "I couldn't generate a response.";

            console.log("🤖 Gemini Response:", aiResponse);
            speakText(aiResponse);
        } catch (error) {
            console.error("⚠️ Error communicating with backend:", error);
        }
    }, []);

    // Finalize user's speech and send to Gemini
    const finalizeSpeech = useCallback((text) => {
        if (!text.trim()) return;
        if (text.toLowerCase().includes("exit")) {
            speakText("Exiting the application. Goodbye!");
            setTimeout(() => window.close(), 2000);
            return;
        }
        sendPromptToGemini(text);
    }, [sendPromptToGemini]);

    useEffect(() => {
        if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            console.error("⚠️ Speech recognition not supported in this browser.");
            return;
        }

        recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = false; // Prevent processing incomplete words
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let transcript = event.results[event.results.length - 1][0].transcript.trim();

            console.log("🎤 User Said:", transcript);

            clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = setTimeout(() => {
                finalizeSpeech(transcript);
            }, 1000); // Process only final transcript after delay
        };

        recognition.onend = () => {
            console.log("🎤 Speech recognition stopped.");
            if (isListening.current && !window.speechSynthesis.speaking) {
                setTimeout(startListening, 2000); // Restart only after 2 seconds
            }
        };

        startListening();

        return () => {
            isListening.current = false;
            recognition.stop();
            clearTimeout(speechTimeoutRef.current);
        };
    }, [finalizeSpeech]);

    const startListening = () => {
        if (isListening.current || window.speechSynthesis.speaking) return; // Avoid conflicts
        isListening.current = true;
        recognitionRef.current.start();
        console.log("🎙️ Started listening...");
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: "100vh" }}>
            <Loader1 />
        </div>
    );
};

export default SpeechAssistant;
