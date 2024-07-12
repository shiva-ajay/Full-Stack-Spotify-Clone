import React, { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const url = 'http://localhost:4000';

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id) => {
        const selectedTrack = songsData.find(item => item._id === id);
        if (selectedTrack) {
            setTrack(selectedTrack);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const previous = async () => {
      if (!track || !audioRef.current) {
          console.log("Track or audio reference is missing");
          return;
      }
  
      const currentIndex = songsData.findIndex(item => item._id === track._id);
      if (currentIndex > 0) {
          const previousTrack = songsData[currentIndex - 1];
          console.log("Previous track:", previousTrack);
  
          // Set the previous track
          setTrack(previousTrack);
  
          // Ensure state is updated before playing
          setTimeout(async () => {
              if (audioRef.current) {
                  try {
                      await audioRef.current.play();
                      setPlayStatus(true);
                      console.log("Playing previous track");
                  } catch (error) {
                      console.error("Error playing the previous track:", error);
                  }
              }
          }, 100); // Small timeout to ensure state update
      } else {
          console.log("No previous track available");
      }
  };
  

    const next = async () => {
      if (!track || !audioRef.current) {
          console.log("Track or audio reference is missing");
          return;
      }
  
      const currentIndex = songsData.findIndex(item => item._id === track._id);
      if (currentIndex < songsData.length - 1) {
          const nextTrack = songsData[currentIndex + 1];
          console.log("Next track:", nextTrack);
  
          // Set the next track
          setTrack(nextTrack);
  
          // Ensure state is updated before playing
          setTimeout(async () => {
              if (audioRef.current) {
                  try {
                      await audioRef.current.play();
                      setPlayStatus(true);
                      console.log("Playing next track");
                  } catch (error) {
                      console.error("Error playing the next track:", error);
                  }
              }
          }, 100); // Small timeout to ensure state update
      } else {
          console.log("No next track available");
      }
  };
  

    const seekSong = (e) => {
        if (audioRef.current) {
            audioRef.current.currentTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
        }
    };

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            setSongsData(response.data.songs);
            if (response.data.songs.length > 0) {
                setTrack(response.data.songs[0]);
            }
        } catch (error) {
            console.error("Error fetching songs data:", error);
        }
    };

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            setAlbumsData(response.data.albums);
        } catch (error) {
            console.error("Error fetching albums data:", error);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            const updateTime = () => {
                seekBar.current.style.width = `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%`;
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60),
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60),
                    },
                });
            };
            audioRef.current.ontimeupdate = updateTime;
        }
    }, [audioRef]);

    useEffect(() => {
        getSongsData();
        getAlbumsData();
    }, []);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong,
        songsData, albumsData
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
