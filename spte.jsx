import { useEffect, useState } from "react";

const VoiceRecognitionPage = () => {
    const [message, setMessage] = useState("Listening...");
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        // Play the audio message automatically
        const speakText = () => {
            const speech = new SpeechSynthesisUtterance("Can you hear this audio?");
            speech.lang = "en-US";
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        };

        speakText();

        // Start speech recognition after 2 seconds
        setTimeout(() => {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setMessage("Listening...");

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                setMessage(`You said: ${transcript}`);
                if (transcript.includes("yes")) {
                    setRedirect(true);
                }
            };

            recognition.onerror = () => setMessage("Could not understand. Try again.");

            recognition.start();

            // Stop recording after 5 seconds
            setTimeout(() => {
                recognition.stop();
            }, 5000);
        }, 2000);
    }, []);

    useEffect(() => {
        if (redirect) {
            setTimeout(() => {
                window.location.href = "/nextpage"; // Change the redirect page URL
            }, 2000);
        }
    }, [redirect]);

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Voice Recognition</h1>
            <p className="text-lg text-blue-600">{message}</p>
            {redirect && <p className="text-green-600 mt-4">Redirecting...</p>}
        </div>
    );
};

export default VoiceRecognitionPage;
