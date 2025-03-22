import React, { useEffect, useState } from 'react';

const YouTubeWithCaptions = ({ videoId }) => {
    const [currentCaption, setCurrentCaption] = useState('Loading captions...');
    let player;

    // Transcript Data with Timestamps
    const transcript = [
        { time: 0, text: "If you only have 24 hours in a day," },
        { time: 3.292, text: "Your success is dependent upon how you use the 24." }]

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
