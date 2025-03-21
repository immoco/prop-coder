import { useState, useEffect } from "react";

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="flex flex-col justify-center items-center w-40 h-40 bg-white rounded-full shadow-lg text-center">
                <p className="text-lg font-semibold">Countdown Timer</p>
                <div className="text-4xl font-bold text-green-700">
                    {timeLeft > 0 ? timeLeft : "Time's Up!"}
                </div>
            </div>
        </div>
    );
}