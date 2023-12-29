// src/components/VideoPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import * as faceapi from 'face-api.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  };

  const detectFaces = async () => {
    await loadModels();

    const video = videoRef.current;
    const canvas = new fabric.Canvas(canvasRef.current);
    canvas.setWidth(video.width);
    canvas.setHeight(video.height);

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
    const faceRects = detections.map((detection) => new fabric.Rect({
      left: detection.detection.box.left,
      top: detection.detection.box.top,
      width: detection.detection.box.width,
      height: detection.detection.box.height,
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
    }));

    canvas.clear();
    faceRects.forEach((rect) => canvas.add(rect));
  };

  const handlePlayPause = () => {
    const playVideo = async () => {
      const video = videoRef.current;
      try {
        await video.play();
        detectFaces();
      } catch (error) {
        console.error("Error playing the video:", error);
      }
    };

    setIsPlaying((prevIsPlaying) => {
      if (!prevIsPlaying) {
        playVideo();
      } else {
        videoRef.current.pause();
      }
      return !prevIsPlaying;
    });
  };

  const handleVideoChange = () => {
    const video = videoRef.current;
    const fileInput = fileInputRef.current;

    const file = fileInput.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener('play', handlePlayPause);
    video.addEventListener('pause', handlePlayPause);

    return () => {
      video.removeEventListener('play', handlePlayPause);
      video.removeEventListener('pause', handlePlayPause);
    };
  }, []);

  return (
    <div>
      <input type="file" accept="video/*" ref={fileInputRef} onChange={handleVideoChange} />
      <video ref={videoRef} controls />
      <canvas ref={canvasRef} />
      {/* <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button> */}
    </div>
  );
};

export default VideoPlayer;
