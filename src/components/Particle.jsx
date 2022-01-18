import React, { useEffect, useRef } from "react";
import "../sass/particle.scss";
import { colorList, randomInt, randomWords } from "../utils/common";
import P from "../utils/particle";

const Particle = () => {
  const canvas = useRef(null);
  const ctx = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    initCanvas();
    startAnimation(randomWords());

    return () => window.cancelAnimationFrame(timer.current);
  }, []);

  const initCanvas = () => {
    ctx.current = canvas.current.getContext("2d");
    canvas.current.width = window.innerWidth;
    canvas.current.height = window.innerHeight;
  };

  const startAnimation = (targets, index = 0) => {
    console.log(targets, index);
    const particles = createParticles({ target: targets[index], radius: 2, interval: 3 });
    drawFrame(particles, () => {
      index += 1;
      index < targets.length && targets[index]
        ? startAnimation(targets, index)
        : startAnimation(randomWords());
    });
  };

  const drawFrame = (particles, finished) => {
    timer.current = window.requestAnimationFrame(() => drawFrame(particles, finished));
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

    const speed = particles.length / 60_000;
    const easing = speed < 0.05 ? 0.05 : speed;
    const finishedParticles = particles.filter(particle => {
      const { x, y, targetX, targetY } = particle;
      const distanceX = targetX - x;
      const distanceY = targetY - y;
      const moveX = easing * distanceX;
      const moveY = easing * distanceY;

      if (Math.abs(moveX) < 0.1 && Math.abs(moveY) < 0.1) {
        particle.finished = true;
        particle.x = targetX;
        particle.y = targetY;
      } else {
        particle.x += moveX;
        particle.y += moveY;
      }

      particle.drawCanvas(ctx.current);
      return particle.finished;
    });

    if (finishedParticles.length === particles.length) {
      window.cancelAnimationFrame(timer.current);
      finished && finished();
    }
  };

  return (
    <canvas id="canvas" ref={canvas}></canvas>
  )
};

const createParticles = ({ target, radius, interval }) => {
  const pixels = getWordPixels(target, interval);

  return pixels.map(({ x, y, rgba }) => {
    return new P({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: x,
      targetY: y,
      radius,
      color: `rgba(${rgba})`,
    });
  });
};

const getWordPixels = (target, interval = 5) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  canvas.width = viewWidth;
  canvas.height = viewHeight;

  if (typeof target === "string") {
    const wordWidth = viewWidth / 2.5;
    const pixel = target.length < 3 ? wordWidth : wordWidth * 3 / (1 + target.length);
    const color = colorList[randomInt(0, colorList.length)];

    ctx.font = `${pixel}px bold`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(target, viewWidth * 0.5, viewHeight * 0.5);
  } else {
    const startX = (viewWidth - target.width) * 0.5;
    const startY = (viewHeight - target.height) * 0.5;
    
    target.complete && ctx.drawImage(target, startX, startY, target.width, target.height);
  }

  const { data, width, height } = ctx.getImageData(0, 0, viewWidth, viewHeight);
  const pixels = [];

  for (let x = 0; x < width; x += interval) {
    for (let y = 0; y < height; y += interval) {
      const pos = (y * width + x) * 4;

      if (data[pos + 3] > 128) {
        pixels.push({ x, y, rgba: [data[pos], data[pos + 1], data[pos + 2], data[pos + 3]] })
      }
    }
  }
  return pixels;
};

export default Particle;