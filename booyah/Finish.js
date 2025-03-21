import React, { useState, useEffect } from "react";

const EmbeddedComponents = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [step, setStep] = useState("timer");

  useEffect(() => {
    if (timeLeft <= 0) {
      setStep("pic");
    }
    
    const timer = timeLeft > 0 ? setInterval(() => setTimeLeft(prev => prev - 1), 1000) : null;
    const redirectTimer = setTimeout(() => {
      if (step === "pic") window.location.href = "nextpage.html";
    }, 10000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [timeLeft, step]);

  const handleYesClick = () => {
    if (step === "pic") {
      setStep("aud");
    } else if (step === "aud") {
      setStep("speak");
    } else {
      window.location.href = "nextpage.html";
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", backgroundColor: "#f4f4f4", fontFamily: "Arial, sans-serif" }}>
      {step === "timer" && (
        <div>
          <h2>10-Second Timer</h2>
          <div style={{ fontSize: "48px", fontWeight: "bold", color: "#2C5F2D" }}>{timeLeft}</div>
        </div>
      )}

      {step === "pic" && (
        <div>
          <h2>Can you see the picture?</h2>
          <img src="food.jpeg" alt="A beautiful scene" style={{ maxWidth: "100%", height: "auto", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }} />
          <button onClick={handleYesClick} style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>Yes</button>
        </div>
      )}

      {step === "aud" && (
        <div>
          <h2>You are Mute?</h2>
          <button onClick={handleYesClick} style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>Yes</button>
          <button onClick={handleYesClick} style={{ backgroundColor: "#dc3545", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>No</button>
        </div>
      )}

      {step === "speak" && (
        <div>
          <h2>You are Deaf?</h2>
          <button onClick={handleYesClick} style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>Yes</button>
          <button onClick={handleYesClick} style={{ backgroundColor: "#dc3545", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>No</button>
        </div>
      )}
    </div>
  );
};

export default EmbeddedComponents;
