import React, { useState, useRef, useEffect } from 'react';
import songs from '../songs'; // Asegúrate de que esta ruta sea correcta
import '../styles/player.css'; // Asegúrate de que esta ruta sea correcta

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };

  // Manejar la reproducción y el volumen
  useEffect(() => {
    const currentAudio = audioRef.current;

    if (isPlaying) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }

    currentAudio.volume = volume;

    const updateTime = () => {
      setCurrentTime(currentAudio.currentTime);
    };

    currentAudio.addEventListener('timeupdate', updateTime);

    return () => {
      currentAudio.removeEventListener('timeupdate', updateTime);
    };
  }, [isPlaying, volume]);

  // Cambiar de canción
  useEffect(() => {
    const currentAudio = audioRef.current;

    currentAudio.src = songs[currentSongIndex].src;
    currentAudio.load();

    if (isPlaying) {
      currentAudio.play();
    }

    setCurrentTime(0);
  }, [currentSongIndex, isPlaying]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="player-container">
      <div className="song-info">
        <img className="album-cover" src="https://via.placeholder.com/120" alt="Album Cover" />
        <h3>{songs[currentSongIndex].title}</h3>
        <h4>{songs[currentSongIndex].artist}</h4>
      </div>
      <audio ref={audioRef} src={songs[currentSongIndex].src} />
      <div className="controls">
        <button onClick={prevSong}>Prev</button>
        <button onClick={playPauseHandler}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextSong}>Next</button>
      </div>
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>
      <div className="progress-container">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={audioRef.current ? audioRef.current.duration : 0}
          value={currentTime}
          onChange={handleTimeChange}
        />
        <span>{formatTime(audioRef.current ? audioRef.current.duration : 0)}</span>
      </div>
    </div>
  );
};

export default Player;
