import React, { useState, useEffect } from "react";

const questions = [
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
  { question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"], correct: 1 },
  { question: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"], correct: 2 },
  { question: "What is the chemical symbol for Gold?", options: ["Au", "Ag", "Fe", "Pb"], correct: 0 }
];

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      nextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestion = () => {
    setAnswered(false);
    setTimeLeft(10);
  };

  const selectAnswer = (index) => {
    if (answered) return;
    setAnswered(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      loadQuestion();
    } else {
      alert(`Quiz Over! Your final score is: ${score}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      <h2>{questions[currentQuestion].question}</h2>
      <p className="text-red-500">Time left: {timeLeft}s</p>
      <div className="space-y-2">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => selectAnswer(index)}
            className={`block w-full p-2 rounded-md ${answered && index === questions[currentQuestion].correct ? "bg-green-300" : answered ? "bg-red-300" : "bg-gray-200 hover:bg-gray-300"}`}
            disabled={answered}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={nextQuestion} className="px-4 py-2 bg-blue-500 text-white rounded-md">Next</button>
      <p>Score: {score}</p>
    </div>
  );
}
