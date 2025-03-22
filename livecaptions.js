import React, { useEffect, useState } from 'react';

const YouTubeWithCaptions = ({ videoId }) => {
    const [currentCaption, setCurrentCaption] = useState('Loading captions...');
    let player;

    // Transcript Data with Timestamps
    const transcript = [
        { time: 0, text: "If you only have 24 hours in a day," },
        { time: 3.292, text: "Your success is dependent upon how you use the 24." },
        { time: 8.267, text: "You got to hear me." },
        { time: 8.957, text: "People talk about Oprah Winfrey, Ted Turner, Warren Buffett." },
        { time: 12.699, text: "Listen to me. I don't care how much money you make." },
        { time: 15.003, text: "You only get 24 hours in a day." },
        { time: 17.086, text: "And the difference between Oprah and the person that's broke" },
        { time: 20.119, text: "is Oprah uses her 24 hours wisely." },
        { time: 24.740, text: "That's it. Listen to me." },
        { time: 26.289, text: "That's it. You get 24." },
        { time: 27.890, text: "I don't care if you grew up broke." },
        { time: 30.467, text: "I don't care if you grew up rich," },
        { time: 32.168, text: "I don't care you're in college, you're not in college." },
        { time: 34.707, text: "You only get 24 hours, and I blew up literally." },
        { time: 38.692, text: "I went from being a high school dropout" },
        { time: 41.131, text: "to selling 6,000 books in less than six months." },
        { time: 44.098, text: "What happened in my 24 hours?" },
        { time: 46.888, text: "I was like, okay, here you got to get a grip on your 24 hours" },
        { time: 48.875, text: "'cause you about to be broke for the rest of your life." },
        { time: 51.275, text: "And it just, all I need you to do for me." },
        { time: 52.840, text: "I can tell you all about your life." },
        { time: 54.662, text: "If you just write down your 24-hour schedule for me," },
        { time: 57.113, text: "you let me look at it." },
        { time: 58.066, text: "I can tell you where you're gonna be in five years." },
        { time: 59.479, text: "I can tell you where you're gonna be in ten years." },
        { time: 61.009, text: "I can tell you where you gonna be in 20 years," },
        { time: 62.169, text: "if you keep that schedule." }
    ];

    // Load YouTube IFrame API
    useEffect(() => {
        const loadYouTubeAPI = () => {
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = initializePlayer;
            } else {
                initializePlayer();
            }
        };

        const initializePlayer = () => {
            player = new window.YT.Player('youtube-player', {
                height: '360',
                width: '640',
                videoId: videoId,
                events: {
                    'onReady': () => updateCaptions(),
                    'onStateChange': (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            updateCaptions();
                        }
                    }
                }
            });
        };

        loadYouTubeAPI();
    }, [videoId]);

    // Update Captions Based on Video Time
    const updateCaptions = () => {
        setInterval(() => {
            if (!player) return;
            let currentTime = player.getCurrentTime();
            let latestCaption = transcript.find((t, i) => 
                currentTime >= t.time && (!transcript[i + 1] || currentTime < transcript[i + 1].time)
            );

            setCurrentCaption(latestCaption ? latestCaption.text : " ");
        }, 500);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {/* YouTube Player */}
            <div id="youtube-player"></div>

            {/* Caption Box */}
            <div style={{
                marginTop: '20px',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#fff',
                padding: '20px',
                borderRadius: '15px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #007bff, #00c6ff)',
                border: '2px solid #0056b3',
                boxShadow: '0 0 15px rgba(0, 123, 255, 0.8)',
                animation: 'glowEffect 1.5s infinite alternate ease-in-out'
            }}>
                {currentCaption}
            </div>

            <style>{`
                @keyframes glowEffect {
                    0% { box-shadow: 0 0 15px rgba(0, 123, 255, 0.8); }
                    100% { box-shadow: 0 0 25px rgba(0, 255, 255, 1); }
                }
            `}</style>
        </div>
    );
};

export default YouTubeWithCaptions;
