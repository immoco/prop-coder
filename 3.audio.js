export default function SpeechComponent() {
    const speakText = () => {
        const text = "Can you hear the voice?";
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            <button 
                onClick={speakText} 
                className="px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 mb-4"
            >
                Speak
            </button>
            <div className="space-x-4">
                <button className="px-5 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">Yes</button>
                <button className="px-5 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">No</button>
            </div>
        </div>
    );
}
