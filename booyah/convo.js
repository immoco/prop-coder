    <script>
        function playAudioAndRecord() {
            if (!('speechSynthesis' in window)) {
                document.getElementById("message").innerText = "Speech Synthesis not supported.";
                return;
            }

            const text = "Can you hear this audio say only...yes ?";
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = "en-US";
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);

            speech.onend = function () {
                document.getElementById("message").innerText = "Listening for response...";
                startSpeechRecognition();
            };
        }

        function startSpeechRecognition() {
            if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
                document.getElementById("message").innerText = "Speech Recognition not supported in this browser.";
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

            recognition.onresult = function (event) {
                const transcript = event.results[0][0].transcript.toLowerCase();
                document.getElementById("message").innerText = "You said: " + transcript;

                if (transcript.includes("yes")) {
                    setTimeout(() => {
                        window.location.href = "nextpage.html";
                    }, 1000);
                }
            };

            recognition.onerror = function (event) {
                document.getElementById("message").innerText = "Error: " + event.error;
                console.error("Speech Recognition Error:", event.error);
            };
        }

        window.onload = playAudioAndRecord;
    </script>
