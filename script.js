class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.playlist = document.getElementById('playlist');
        this.currentSongTitle = document.getElementById('currentSongTitle');
        this.currentArtist = document.getElementById('currentArtist');
        this.albumCover = document.getElementById('albumCover');

        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, one, all
        this.songs = [];
        this.lovePoints = 0;
        this.heartClicks = 0;
        this.loveMessages = [
            "Mercedes, eres mi sol ☀️",
            "Mi princesa hermosa 👑",
            "Eres mi estrella más brillante ⭐",
            "Mi corazón late por ti 💓",
            "Eres mi mundo entero 🌍",
            "Mi amor infinito 💖",
            "Eres mi felicidad 😊",
            "Mi princesita adorada 💕"
        ];

        this.initializePlayer();
        this.loadSampleSongs();
    }

    initializePlayer() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());

        // Shuffle and repeat buttons
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());

        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));

        // Volume control
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        // Set initial volume
        this.audio.volume = 0.7;
    }

    loadSampleSongs() {
        // ANIMA 14 Album Songs
        this.songs = [
            {
                title: "sweetheart smpl (INTERLUDE)",
                artist: "ANIMA 14",
                duration: "2:45",
                src: "song1.mp3",
                cover: "meche.jpg",
                loveMessage: "Para mi princesa hermosa que ilumina mis días ✨"
            },
            {
                title: "Esta pq t amo",
                artist: "ANIMA 14",
                duration: "3:28",
                src: "song2.mp3",
                cover: "meche.jpg",
                loveMessage: "Mercedes, eres mi mundo entero 💖"
            },
            {
                title: "type beat love for you, meche, my love, my star",
                artist: "ANIMA 14",
                duration: "4:15",
                src: "song3.mp3",
                cover: "meche.jpg",
                loveMessage: "Mi estrella brillante, mi amor eterno 🌟💕"
            }
        ];

        this.renderPlaylist();
        this.loadSong(0);
        this.initializeLoveFeatures();
    }

    renderPlaylist() {
        this.playlist.innerHTML = '';
        this.songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.innerHTML = `
                <div class="song-number">${index + 1}</div>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-duration" id="duration-${index}">--:--</div>
            `;
            songItem.addEventListener('click', () => this.playSong(index));
            this.playlist.appendChild(songItem);
        });
    }

    loadSong(index) {
        const song = this.songs[index];
        this.audio.src = song.src;
        this.currentSongTitle.textContent = song.title;
        this.currentArtist.textContent = song.artist;
        this.albumCover.src = song.cover;
        this.currentSongIndex = index;
        this.updateActivePlaylistItem();
        
        // Show duration only when song is loaded/playing
        this.audio.addEventListener('loadedmetadata', () => {
            const durationEl = document.getElementById(`duration-${index}`);
            if (durationEl) {
                durationEl.textContent = song.duration;
            }
        });
    }

    playSong(index) {
        this.loadSong(index);
        this.play();
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            document.querySelector('.album-player').classList.add('playing');
        }).catch(error => {
            console.log('Error playing audio:', error);
            // For demo purposes, we'll simulate playback
            this.simulatePlayback();
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.album-player').classList.remove('playing');
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    previousSong() {
        let prevIndex = this.currentSongIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.songs.length - 1;
        }
        this.playSong(prevIndex);
    }

    nextSong() {
        let nextIndex;
        if (this.isShuffled) {
            nextIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            nextIndex = this.currentSongIndex + 1;
            if (nextIndex >= this.songs.length) {
                nextIndex = 0;
            }
        }
        this.playSong(nextIndex);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        this.repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
        
        if (this.repeatMode === 'one') {
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i><span style="font-size: 0.7em;">1</span>';
        } else {
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }

    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration || 0;
        
        if (duration > 0) {
            this.audio.currentTime = (clickX / width) * duration;
        }
    }

    updateProgress() {
        const { duration, currentTime } = this.audio;
        
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
            
            this.currentTimeEl.textContent = this.formatTime(currentTime);
            this.totalTimeEl.textContent = this.formatTime(duration);
        }
    }

    updateDuration() {
        if (this.audio.duration) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }

    setVolume(volume) {
        this.audio.volume = volume / 100;
    }

    handleSongEnd() {
        if (this.repeatMode === 'one') {
            this.play();
        } else if (this.repeatMode === 'all' || this.currentSongIndex < this.songs.length - 1) {
            this.nextSong();
        } else {
            this.pause();
        }
    }

    updateActivePlaylistItem() {
        const items = this.playlist.querySelectorAll('.song-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }

    formatTime(time) {
        if (isNaN(time)) return '0:00';
        
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Initialize love-themed interactive features
    initializeLoveFeatures() {
        this.createHeartClickGame();
        this.createLoveMessageDisplay();
        this.createStarCollector();
        this.createLoveCard();
        this.addAlbumClickEffects();
    }

    createHeartClickGame() {
        const heartGame = document.createElement('div');
        heartGame.className = 'heart-game';
        heartGame.innerHTML = `
            <div class="love-counter">
                <span class="heart-icon" id="heartIcon">💖</span>
                <span id="lovePoints">${this.lovePoints}</span>
                <span class="love-text">Amor</span>
            </div>
        `;
        document.querySelector('.album-cover-section').appendChild(heartGame);

        document.getElementById('heartIcon').addEventListener('click', () => {
            this.heartClicks++;
            this.lovePoints += 10;
            document.getElementById('lovePoints').textContent = this.lovePoints;
            this.showFloatingHeart();
            this.checkLoveAchievements();
        });
    }

    showFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '💕';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 300 + 'px';
        heart.style.top = '50px';
        heart.style.fontSize = '24px';
        heart.style.zIndex = '1000';
        heart.style.animation = 'floatUp 2s ease-out forwards';
        document.querySelector('.album-cover-section').appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    }

    checkLoveAchievements() {
        if (this.heartClicks === 10) {
            this.showLoveMessage("¡Mercedes, eres increíble! 💖");
        } else if (this.heartClicks === 25) {
            this.showLoveMessage("¡Mi princesa hermosa! 👑✨");
        } else if (this.heartClicks === 50) {
            this.showLoveMessage("¡Eres mi estrella más brillante! 🌟💕");
        }
    }

    createLoveMessageDisplay() {
        const messageDisplay = document.createElement('div');
        messageDisplay.className = 'love-message-display';
        messageDisplay.id = 'loveMessageDisplay';
        document.querySelector('.player-section').appendChild(messageDisplay);
    }

    showLoveMessage(message) {
        const display = document.getElementById('loveMessageDisplay');
        display.textContent = message;
        display.style.opacity = '1';
        display.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            display.style.opacity = '0';
            display.style.transform = 'translateY(-20px)';
        }, 3000);
    }

    createStarCollector() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createFallingStar();
            }
        }, 5000);
    }

    createFallingStar() {
        const star = document.createElement('div');
        star.className = 'falling-star';
        star.innerHTML = '⭐';
        star.style.position = 'fixed';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = '-50px';
        star.style.fontSize = '20px';
        star.style.zIndex = '999';
        star.style.cursor = 'pointer';
        star.style.animation = 'fallDown 8s linear forwards';
        
        star.addEventListener('click', () => {
            this.lovePoints += 25;
            document.getElementById('lovePoints').textContent = this.lovePoints;
            this.showLoveMessage("¡Estrella capturada para Mercedes! ⭐💖");
            star.remove();
        });
        
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 8000);
    }

    createLoveCard() {
        // Create the love card button
        const loveCardBtn = document.createElement('button');
        loveCardBtn.className = 'love-card-btn';
        loveCardBtn.innerHTML = '💖 Carta de Amor';
        loveCardBtn.addEventListener('click', () => {
            this.showLoveCard();
        });
        document.querySelector('.controls').appendChild(loveCardBtn);
        
        // Create the love card modal
        const loveCardModal = document.createElement('div');
        loveCardModal.className = 'love-card-modal';
        loveCardModal.id = 'loveCardModal';
        loveCardModal.innerHTML = `
            <div class="love-card">
                <div class="card-header">
                    <h2>💕 Para Mi Amor Eterno 💕</h2>
                    <button class="close-card" id="closeCard">×</button>
                </div>
                <div class="card-body">
                    <div class="heart-decoration">💖</div>
                    <p class="love-message-main">TE AMO MI ESTRELLITA HERMOSA;<br>MI PRINCESITA HERMOSA</p>
                    <div class="stars-decoration">✨ 🌟 ✨</div>
                    <p class="signature">Con todo mi amor,<br>Para Mercedes 💕</p>
                </div>
                <div class="card-footer">
                    <button class="love-response-btn" id="loveResponseBtn">💖 TE AMO TAMBIÉN 💖</button>
                </div>
            </div>
        `;
        document.body.appendChild(loveCardModal);
        
        // Add event listeners
        document.getElementById('closeCard').addEventListener('click', () => {
            this.hideLoveCard();
        });
        
        document.getElementById('loveResponseBtn').addEventListener('click', () => {
            this.showLoveResponse();
        });
        
        // Close on background click
        loveCardModal.addEventListener('click', (e) => {
            if (e.target === loveCardModal) {
                this.hideLoveCard();
            }
        });
    }
    
    showLoveCard() {
        const modal = document.getElementById('loveCardModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        this.startHeartRain();
    }
    
    hideLoveCard() {
        const modal = document.getElementById('loveCardModal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    showLoveResponse() {
        this.showLoveMessage("¡Mercedes respondió con amor! 💕✨");
        this.lovePoints += 100;
        document.getElementById('lovePoints').textContent = this.lovePoints;
        this.startHeartRain();
        setTimeout(() => {
            this.hideLoveCard();
        }, 2000);
    }

    startHeartRain() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = ['💖', '💕', '💗', '💓', '💝'][Math.floor(Math.random() * 5)];
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * window.innerWidth + 'px';
                heart.style.top = '-50px';
                heart.style.fontSize = Math.random() * 20 + 15 + 'px';
                heart.style.zIndex = '998';
                heart.style.animation = 'heartRain 4s ease-in forwards';
                heart.style.pointerEvents = 'none';
                
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 4000);
            }, i * 200);
        }
        this.showLoveMessage("¡Lluvia de amor para Mercedes! 💕💖💗");
    }

    addAlbumClickEffects() {
        this.albumCover.addEventListener('click', () => {
            const currentSong = this.songs[this.currentSongIndex];
            if (currentSong.loveMessage) {
                this.showLoveMessage(currentSong.loveMessage);
            }
            this.createHeartBurst();
        });
    }

    createHeartBurst() {
        const hearts = ['💖', '💕', '💗', '💓', '💝', '💘'];
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'absolute';
            heart.style.left = '150px';
            heart.style.top = '150px';
            heart.style.fontSize = '20px';
            heart.style.zIndex = '1001';
            heart.style.pointerEvents = 'none';
            
            const angle = (i / 8) * 2 * Math.PI;
            const distance = 100;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            heart.style.animation = `heartBurst 1.5s ease-out forwards`;
            heart.style.setProperty('--endX', endX + 'px');
            heart.style.setProperty('--endY', endY + 'px');
            
            document.querySelector('.album-cover').appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }
    }

    // Simulate playback for demo purposes when actual audio fails
    simulatePlayback() {
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.album-player').classList.add('playing');
        
        // Simulate progress based on song duration
        let currentTime = 0;
        const currentSong = this.songs[this.currentSongIndex];
        const durationParts = currentSong.duration.split(':');
        const duration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
        
        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }
            
            currentTime += 1;
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
            
            this.currentTimeEl.textContent = this.formatTime(currentTime);
            this.totalTimeEl.textContent = this.formatTime(duration);
            
            if (currentTime >= duration) {
                clearInterval(interval);
                this.handleSongEnd();
            }
        }, 1000);
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
new MusicPlayer();
});

// Add some visual effects
document.addEventListener('DOMContentLoaded', () => {
// Add floating animation to album cover
const albumCover = document.querySelector('.album-cover');
if (albumCover) {
setInterval(() => {
if (document.querySelector('.album-player').classList.contains('playing')) {
albumCover.style.transform = 'rotate(' + (Math.random() * 2 - 1) + 'deg) scale(1.02)';
setTimeout(() => {
albumCover.style.transform = 'rotate(0deg) scale(1)';
}, 100);
}
}, 3000);
}
// Add pulsing glow effect to the album cover when playing
const player = document.querySelector('.album-player');
if (player) {
setInterval(() => {
const isPlaying = document.querySelector('.album-player').classList.contains('playing');
if (isPlaying && albumCover) {
albumCover.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2), 0 0 30px rgba(156, 136, 255, 0.4)';
setTimeout(() => {
albumCover.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
}, 1000);
}
}, 2000);
}
});
