"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import gsap from "gsap";

const messagePages = [
  "Happy Birthday, baby! Today is your day, and I hope na Kahit busy ka, maFeel and maEnjoy mo pa rin yong birthday mo.",
  "I love everything about you, baby. pero what I really love the most is your personality. I love how kind, and polite you are, and kung pano mo pahalagahan yong mga taong nakapaligid sayo. Gustong gusto ko rin yong principles mo in life, sobrang mature mo mag isip and ang dami dami kong natututunan sayo. I also really really love kung pano mo mapansin and iAppreciate yong mga bagay na para sakin maliliit lang, but binibigyan mo ng importansya. dun ako, baby hulog na hulog sayo HAHAHHAHAHAH",
  "I also really admire kung gano ka kaIndependent and how strong u are. sobrang galing mo, baby. even nong elementary ka pa lang, u are already a fighter. I am very sure na Kahit anong struggles and challenges pa man ang dumating sa buhay mo, kaya mo lahat lampasan, especially now, na you have Daniel in your life na that will always be by your side, and palagi kang sasamahan so you'll never face your challenges alone.",
  "And Fun fact: ngayon din yong ika1st month natin na mag kausap. so, happy monthsary!!! HAHHAHAHHAHAH",
  "Sobrang grateful ko, baby na I met someone like you. You have such a big impact on my life. You became my inspiration, and you make me want to become a better man. Gusto kong maging someone na kayang maiProvide sayo lahat ng deserve mo in the future. I want to be someone that you can rely on.",
  "Happy birthday uli, baby! ang birthday wishes ko for you are good health, safety, and being kept away from any harm. I hope na ngayong nasa 20 ka na, mas makita na sana ng paretns mo yong efforts mo na ginagawa mo for them, sana maAppreciate ka pa nila, and sana magkaroon na sila ng tiwala sayo. look at your hair oh, u re the one decided for yourself, and look huhu sobrang ganda!!! I am also really wishing for your happiness, peace, and success, and i really hope na maging part ako ng future mo. sana palagi kitang babatiin ng happy birthday taon taon. i hope ako yong unang lalaking papalakpak palagi sa mga achievements mo, especially kapag aakyat ka na sa stage for your graduation, and kapag ure a CPA and an Attorney na.",
  "I promise, baby, na hinding hindi mo na mararamdamang mag isa ka uli. i will always be there for you, through ups and downs ng buhay mo. I promise to be your partner in life kung papayagan mo ako, and i promise na i will always love you through everything. Palagi lang akong andito para sayo.",
  "Thank you, baby, for existing and for coming into my life. Happy birthday uli, my future Atty. Ella Alessandra Mae C. Ruiz, CPA, MBA, JD. Mahal na mahal kita <3",
];

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const envelopeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!envelopeRef.current || !letterRef.current || !flapRef.current) return;

    const tl = gsap.timeline();

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const letterOffset = isMobile ? -50 : isTablet ? -75 : -100;
    const letterScale = isMobile ? 1.05 : 1.1;

    if (isOpen) {
      tl.to(flapRef.current, {
        rotationX: 180,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "power2.inOut",
      }).to(
        letterRef.current,
        {
          y: letterOffset,
          opacity: 1,
          scale: letterScale,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    } else {
      tl.to(
        letterRef.current,
        {
          y: 0,
          opacity: 0.2,
          scale: 0.92,
          duration: 0.7,
          ease: "power2.in",
        },
        0
      )
        .to(
          flapRef.current,
          {
            rotationX: 0,
            transformOrigin: "top center",
            duration: 0.8,
            ease: "back.in(1.2)",
          },
          "-=0.4"
        )
        .set(
          [letterRef.current, flapRef.current],
          {
            clearProps: "transform",
          },
          "+=0.1"
        );
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const fadeDuration = 1000;
    const fadeSteps = 20;
    const stepInterval = fadeDuration / fadeSteps;
    const volumeStep = 0.5 / fadeSteps;

    if (isOpen) {
      audio.volume = 0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio play failed (autoplay prevented):", error);
        });
      }

      let currentStep = 0;
      const fadeInInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(volumeStep * currentStep, 0.5);
        audio.volume = newVolume;

        if (currentStep >= fadeSteps) {
          clearInterval(fadeInInterval);
          fadeIntervalRef.current = null;
        }
      }, stepInterval);

      fadeIntervalRef.current = fadeInInterval;
    } else {
      const startVolume = audio.volume;
      let currentStep = 0;

      const fadeOutInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.max(
          startVolume - (startVolume / fadeSteps) * currentStep,
          0
        );
        audio.volume = newVolume;

        if (currentStep >= fadeSteps || newVolume <= 0) {
          clearInterval(fadeOutInterval);
          fadeIntervalRef.current = null;
          audio.pause();
          audio.currentTime = 0;
        }
      }, stepInterval);

      fadeIntervalRef.current = fadeOutInterval;
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      if (audio) {
        audio.pause();
        audio.volume = 0;
        audio.currentTime = 0;
      }
    };
  }, [isOpen]);

  const handleClick = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setCurrentPage(0);
      }
      return !prev;
    });
  }, []);

  const handleSwipe = useCallback((swipeDirection: "left" | "right") => {
    setCurrentPage((prevPage) => {
      if (swipeDirection === "left" && prevPage < messagePages.length - 1) {
        setDirection("left");
        return prevPage + 1;
      } else if (swipeDirection === "right" && prevPage > 0) {
        setDirection("right");
        return prevPage - 1;
      }
      return prevPage;
    });
  }, []);

  const handlePanEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 50;
      if (info.offset.x > threshold) {
        handleSwipe("right");
      } else if (info.offset.x < -threshold) {
        handleSwipe("left");
      }
    },
    [handleSwipe]
  );

  const images = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const hash = (i * 2654435761) % 10000;
      const normalized = hash / 10000;

      const startX = ((hash * 7) % 80) + 10; // 10-90% of viewport
      const startY = ((hash * 11) % 80) + 10; // 10-90% of viewport

      const isLeft = startX < 50;
      const isTop = startY < 50;

      let initialXOffset = 0;
      let initialYOffset = 0;

      const baseOffset = 300;

      if (isLeft && isTop) {
        initialXOffset = -baseOffset;
        initialYOffset = -baseOffset;
      } else if (!isLeft && isTop) {
        initialXOffset = baseOffset;
        initialYOffset = -baseOffset;
      } else if (isLeft && !isTop) {
        initialXOffset = -baseOffset;
        initialYOffset = baseOffset;
      } else {
        initialXOffset = baseOffset;
        initialYOffset = baseOffset;
      }

      return {
        src: `/${i + 1}.jpg`,
        size: 150 + normalized * 150, // Base: 150-300px (will scale with viewport)
        startX,
        startY,
        initialXOffset,
        initialYOffset,
        floatDuration: 20 + normalized * 10, // 20-30 seconds (longer = less frequent updates)
        initialRotate: (hash % 40) - 20, // -20 to 20
        floatAmplitudeX: 10 + (hash % 30), // 10-40px
        floatAmplitudeY: 15 + (hash % 45), // 15-60px
        rotateVariation: (hash % 10) - 5, // -5 to 5
        groupIndex: Math.floor(i / 3), // Group of 3
      };
    });
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/mp3/bg_music.mp3"
        loop
        preload="auto"
        style={{ display: "none" }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
            style={{
              contain: "layout style paint",
              willChange: "contents",
            }}
          >
            {images.map((imageData, index) => {
              const groupDelay = imageData.groupIndex * 0.3; // 3 images at a time, 0.3s between groups
              const withinGroupDelay = (index % 3) * 0.15; // 0.15s between images in same group
              const slideInDelay = groupDelay + withinGroupDelay;
              const opacityDuration = 4 + (index % 4); // 4-8 seconds

              return (
                <motion.img
                  key={imageData.src}
                  src={imageData.src}
                  alt={`Memory ${index + 1}`}
                  className="absolute rounded-lg shadow-2xl object-cover"
                  style={{
                    width: `clamp(${imageData.size * 0.5}px, ${
                      imageData.size * 0.01
                    }vw, ${imageData.size}px)`,
                    height: `clamp(${imageData.size * 0.5}px, ${
                      imageData.size * 0.01
                    }vw, ${imageData.size}px)`,
                    left: `${imageData.startX}%`,
                    top: `${imageData.startY}%`,
                    filter: "brightness(0.95)",
                    willChange: "transform, opacity",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                  loading="lazy"
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                    rotate: imageData.initialRotate,
                    x: `clamp(${imageData.initialXOffset * 0.3}px, ${
                      imageData.initialXOffset * 0.01
                    }vw, ${imageData.initialXOffset}px)`,
                    y: `clamp(${imageData.initialYOffset * 0.3}px, ${
                      imageData.initialYOffset * 0.01
                    }vw, ${imageData.initialYOffset}px)`,
                  }}
                  animate={{
                    opacity: [
                      0, // Start transparent
                      0.5, // Fade in during slide
                      0.4, // Settle to floating opacity
                      0.5, // Float pulse (reduced complexity)
                      0.4, // Back to base
                    ],
                    scale: [
                      0.6, // Start smaller
                      1, // Grow during slide-in
                      1, // Stay at normal size
                      1.03, // Float pulse (reduced)
                      1, // Back to base
                    ],
                    rotate: [
                      imageData.initialRotate, // Start rotated
                      imageData.rotateVariation, // Rotate during slide
                      imageData.rotateVariation - 1, // Float rotation 1 (reduced)
                      imageData.rotateVariation + 1, // Float rotation 2 (reduced)
                      imageData.rotateVariation - 1, // Back to float rotation 1
                    ],
                    x: [
                      imageData.initialXOffset, // Start off-screen
                      0, // Slide to position
                      0, // Stay at position
                      imageData.floatAmplitudeX * 0.7, // Float right (reduced)
                      -imageData.floatAmplitudeX * 0.6, // Float left (reduced)
                      0, // Back to center
                    ],
                    y: [
                      imageData.initialYOffset, // Start off-screen
                      0, // Slide to position
                      0, // Stay at position
                      -imageData.floatAmplitudeY * 0.7, // Float up (reduced)
                      imageData.floatAmplitudeY * 0.5, // Float down (reduced)
                      0, // Back to center
                    ],
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    rotate: imageData.rotateVariation,
                    x: `clamp(${imageData.initialXOffset * 0.3}px, ${
                      imageData.initialXOffset * 0.01
                    }vw, ${imageData.initialXOffset}px)`,
                    y: `clamp(${imageData.initialYOffset * 0.3}px, ${
                      imageData.initialYOffset * 0.01
                    }vw, ${imageData.initialYOffset}px)`,
                    transition: {
                      duration: 0.6,
                      ease: "easeInOut",
                    },
                  }}
                  transition={{
                    x: {
                      times: [0, 0.3, 0.4, 0.8, 0.9, 1],
                      duration: imageData.floatDuration,
                      repeat: Infinity,
                      ease: [
                        [0.25, 0.1, 0.25, 1], // Smooth slide in
                        [0.25, 0.1, 0.25, 1], // Ease to position
                        [0, 0, 1, 1], // Hold
                        "easeInOut", // Float
                        "easeInOut", // Float
                        "easeInOut", // Float
                      ],
                      delay: slideInDelay,
                    },
                    y: {
                      times: [0, 0.3, 0.4, 0.8, 0.9, 1],
                      duration: imageData.floatDuration,
                      repeat: Infinity,
                      ease: [
                        [0.25, 0.1, 0.25, 1], // Smooth slide in
                        [0.25, 0.1, 0.25, 1], // Ease to position
                        [0, 0, 1, 1], // Hold
                        "easeInOut", // Float
                        "easeInOut", // Float
                        "easeInOut", // Float
                      ],
                      delay: slideInDelay,
                    },
                    opacity: {
                      times: [0, 0.3, 0.4, 0.7, 0.85, 1],
                      duration: imageData.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: slideInDelay,
                    },
                    scale: {
                      times: [0, 0.3, 0.4, 0.8, 0.9, 1],
                      duration: imageData.floatDuration,
                      repeat: Infinity,
                      ease: [
                        [0.34, 1.56, 0.64, 1], // Bounce during slide
                        [0.25, 0.1, 0.25, 1], // Settle
                        [0, 0, 1, 1], // Hold
                        "easeInOut", // Float
                        "easeInOut", // Float
                        "easeInOut", // Float
                      ],
                      delay: slideInDelay,
                    },
                    rotate: {
                      times: [0, 0.3, 0.4, 0.8, 0.9, 1],
                      duration: imageData.floatDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: slideInDelay,
                    },
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <div
        className="relative w-full max-w-[1000px] aspect-[4/3] sm:aspect-[5/3] cursor-pointer z-50 mx-auto px-2 sm:px-0"
        onClick={handleClick}
      >
        <motion.div
          ref={envelopeRef}
          className="relative w-full h-full perspective-1000"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: isOpen
              ? "brightness(1)"
              : "brightness(1) drop-shadow(0 0 20px rgba(251, 113, 133, 0.2))",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 rounded-lg sm:rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] overflow-hidden"
            style={{
              backgroundColor: "#faf8f3",
              backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(220,210,200,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(200,190,180,0.3) 0%, transparent 50%),
              linear-gradient(135deg, rgba(240,235,225,0.9) 0%, rgba(250,248,243,0.95) 50%, rgba(245,240,230,0.9) 100%),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.02) 100%)
            `,
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px),
                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.01) 1px, rgba(0,0,0,0.01) 2px),
                radial-gradient(circle at 50% 50%, transparent 0%, rgba(200,190,180,0.1) 100%)
              `,
              }}
            />

            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-[15%] left-[10%] w-8 h-8 rounded-full bg-amber-800/10 blur-sm" />
              <div className="absolute bottom-[25%] right-[15%] w-6 h-6 rounded-full bg-amber-700/10 blur-sm" />
              <div className="absolute top-[60%] left-[80%] w-4 h-4 rounded-full bg-amber-900/8 blur-sm" />
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
              <defs>
                <filter id="sketch">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.9"
                    numOctaves="4"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="0.8"
                  />
                </filter>
                <linearGradient
                  id="borderGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b7355" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#6b5847" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b7355" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect
                x="12"
                y="12"
                width="calc(100% - 24px)"
                height="calc(100% - 24px)"
                fill="none"
                stroke="url(#borderGradient)"
                strokeWidth="1"
                strokeDasharray="3,4"
                filter="url(#sketch)"
                rx="4"
              />
              <rect
                x="18"
                y="18"
                width="calc(100% - 36px)"
                height="calc(100% - 36px)"
                fill="none"
                stroke="#8b7355"
                strokeWidth="0.5"
                strokeDasharray="2,3"
                opacity="0.3"
                rx="2"
              />
            </svg>
            <motion.div
              className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <svg
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]"
                viewBox="0 0 60 60"
                style={{ filter: "url(#sketch-filter)" }}
              >
                <defs>
                  <filter id="sketch-filter">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="1.5"
                      numOctaves="3"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="0.8"
                    />
                  </filter>
                </defs>
                <path
                  d="M 10 20 Q 15 15 20 18 Q 25 15 30 20 Q 28 12 35 15 Q 30 10 40 15"
                  stroke="#6b5847"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 18 22 Q 17 18 15 20"
                  stroke="#5a4a3a"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path
                  d="M 25 18 Q 27 15 29 17"
                  stroke="#5a4a3a"
                  strokeWidth="0.8"
                  fill="none"
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute top-5 right-4 sm:top-10 sm:right-10 md:top-14 md:right-16 opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <svg
                className="w-7 h-7 sm:w-10 sm:h-10 md:w-[55px] md:h-[55px]"
                viewBox="0 0 55 55"
              >
                <path
                  d="M 45 15 Q 40 12 35 15 Q 40 18 45 15 Q 42 8 35 10 Q 40 5 45 10"
                  stroke="#6b5847"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="text-center relative">
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-handwriting mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 relative px-2 sm:px-3 md:px-4"
                  style={{
                    color: "#5a4a3a",
                    textShadow: `
                    0.5px 0.5px 0px rgba(0,0,0,0.1),
                    1px 1px 0px rgba(0,0,0,0.05),
                    0 0 2px rgba(90,74,58,0.1)
                  `,
                    letterSpacing: "clamp(0.5px, 1.5vw, 2px)",
                    fontWeight: "600",
                    filter: "contrast(1.1) brightness(0.95)",
                  }}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    filter: [
                      "contrast(1.1) brightness(0.95)",
                      "contrast(1.15) brightness(0.93)",
                      "contrast(1.1) brightness(0.95)",
                    ],
                  }}
                  transition={{
                    y: { delay: 0.4, duration: 0.6 },
                    opacity: { delay: 0.4, duration: 0.6 },
                    filter: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  Happy Birthday,
                </motion.h1>
                <motion.h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-handwriting relative px-2 sm:px-3 md:px-4"
                  style={{
                    color: "#4a3d2f",
                    textShadow: `
                    0.5px 0.5px 0px rgba(0,0,0,0.1),
                    1px 1px 0px rgba(0,0,0,0.08),
                    0 0 2px rgba(74,61,47,0.12)
                  `,
                    letterSpacing: "clamp(1px, 2.5vw, 3px)",
                    fontWeight: "700",
                    filter: "contrast(1.15) brightness(0.92)",
                    transform: "rotate(-0.5deg)",
                  }}
                  initial={{ y: 5, opacity: 0, rotate: -0.5 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotate: -0.5,
                    filter: [
                      "contrast(1.15) brightness(0.92)",
                      "contrast(1.2) brightness(0.9)",
                      "contrast(1.15) brightness(0.92)",
                    ],
                  }}
                  transition={{
                    y: { delay: 0.5, duration: 0.6 },
                    opacity: { delay: 0.5, duration: 0.6 },
                    filter: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    },
                  }}
                >
                  Sandy
                </motion.h2>

                {/* Subtle underline sketch */}
                <motion.div
                  className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 sm:w-auto"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                >
                  <svg
                    className="w-full h-1 sm:h-[4px] max-w-[400px]"
                    viewBox="0 0 400 4"
                    preserveAspectRatio="none"
                    style={{ opacity: 0.25 }}
                  >
                    <path
                      d="M 0 2 Q 100 1 200 2 T 400 2"
                      stroke="#6b5847"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 md:bottom-16 md:right-20"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
            >
              <div className="relative">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      className="w-1 h-1 rounded-full bg-yellow-200"
                      style={{
                        transform: `rotate(${i * 120}deg) translateY(-20px)`,
                      }}
                    />
                  </motion.div>
                ))}
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, #dc2626, #b91c1c, #991b1b, #7f1d1d)",
                    boxShadow: `
                    0 6px 12px rgba(0,0,0,0.4),
                    inset -4px -4px 8px rgba(0,0,0,0.5),
                    inset 3px 3px 6px rgba(255,255,255,0.15),
                    0 0 0 1px rgba(0,0,0,0.3),
                    0 0 20px rgba(220,38,38,0.3)
                  `,
                    filter: "contrast(1.3) brightness(0.95)",
                  }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    viewBox="0 0 32 32"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="6"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1"
                    />
                    <path
                      d="M 16 4 L 16 8 M 16 24 L 16 28 M 4 16 L 8 16 M 24 16 L 28 16"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div
                  className="absolute inset-0 rounded-full opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 35%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 75% 65%, rgba(255,200,200,0.2), transparent 50%)",
                  }}
                />
                <div
                  className="absolute top-1 left-2 w-4 h-4 rounded-full opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.6), transparent)",
                    filter: "blur(2px)",
                  }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            ref={flapRef}
            className="absolute top-0 left-0 right-0 h-[46.67%] rounded-t-lg sm:rounded-t-xl transform-gpu preserve-3d origin-top overflow-hidden"
            style={{
              clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
              zIndex: 2,
              backgroundColor: "#f5f2ec",
              backgroundImage: `
              linear-gradient(to bottom, rgba(250,248,243,0.98) 0%, rgba(245,242,236,0.96) 50%, rgba(240,235,230,0.94) 100%),
              radial-gradient(circle at 50% 20%, rgba(220,210,200,0.4) 0%, transparent 60%),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 40%)
            `,
              boxShadow:
                "inset 0 -3px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6), 0 3px 8px rgba(0,0,0,0.12)",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              borderLeft: "1px solid rgba(0,0,0,0.08)",
              borderRight: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.01) 1px, rgba(0,0,0,0.01) 2px)
              `,
              }}
            />

            <svg
              className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-3 sm:h-4 md:h-6"
              style={{ opacity: 0.15 }}
            >
              <path
                d="M 0 3 Q 100 1 200 3 T 400 3 T 600 3 T 800 3"
                stroke="#8b7355"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="1,2"
              />
            </svg>
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={letterRef}
                className="absolute inset-x-0 top-[46.67%] h-[53.33%] rounded-sm shadow-2xl z-[60] p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 overflow-hidden"
                initial={{ y: 0, opacity: 0.3, scale: 0.95 }}
                animate={{
                  y: [0, "-6vw", "-8vw", "-10vw"],
                  opacity: 1,
                  scale: [0.95, 1.05, 1.08, 1.1],
                }}
                exit={{
                  y: 0,
                  opacity: 0.2,
                  scale: 0.92,
                  transition: {
                    duration: 0.7,
                    ease: [0.4, 0, 1, 1],
                  },
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.3,
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  zIndex: 60,
                  backgroundColor: "#fefcf8",
                  backgroundImage: `
                  radial-gradient(circle at 30% 40%, rgba(254,252,248,0.9) 0%, rgba(250,245,235,0.95) 100%),
                  linear-gradient(135deg, rgba(255,250,240,0.5) 0%, rgba(252,248,240,0.7) 100%)
                `,
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px),
                    repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px),
                    radial-gradient(circle at 20% 30%, rgba(200,190,180,0.15) 0%, transparent 40%)
                  `,
                  }}
                />

                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-[20%] right-[15%] w-6 h-6 rounded-full bg-amber-800/20 blur-sm" />
                  <div className="absolute bottom-[30%] left-[10%] w-4 h-4 rounded-full bg-amber-700/15 blur-sm" />
                </div>

                <motion.div
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 opacity-15"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-[35px] md:h-[35px]"
                    viewBox="0 0 35 35"
                  >
                    <path
                      d="M 5 8 Q 12 5 18 8 Q 15 3 22 6"
                      stroke="#8b7355"
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>

                <motion.div
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 opacity-15"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-[35px] md:h-[35px]"
                    viewBox="0 0 35 35"
                  >
                    <path
                      d="M 30 8 Q 23 5 17 8 Q 20 3 13 6"
                      stroke="#8b7355"
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>

                <motion.div
                  className="relative z-10 h-full flex flex-col"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                  onPanEnd={handlePanEnd}
                >
                  <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-[#8b7355]/30 scrollbar-track-transparent"
                    style={{
                      maxHeight: "calc(100% - 50px)",
                      willChange: "scroll-position",
                      contain: "layout style paint",
                    }}
                  >
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentPage}
                        className="w-full min-h-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 flex items-center justify-center"
                        custom={direction}
                        initial={{
                          x: direction === "left" ? 200 : -200,
                          opacity: 0,
                        }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{
                          x: direction === "left" ? -200 : 200,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.1, 0.25, 1],
                          x: { type: "tween", ease: [0.25, 0.1, 0.25, 1] },
                        }}
                        style={{
                          willChange: "transform, opacity",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <motion.p
                          className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-handwriting text-[#3a2f25] leading-[1.7] sm:leading-[1.8] md:leading-[1.9] lg:leading-[2] text-center max-w-[98%] sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] w-full"
                          style={{
                            textShadow:
                              "0.5px 0.5px 1px rgba(0,0,0,0.08), 0 0 2px rgba(0,0,0,0.05)",
                            letterSpacing: "0.5px",
                            fontWeight: "500",
                            transform: `rotate(${
                              currentPage % 2 === 0 ? -0.15 : 0.1
                            }deg)`,
                          }}
                        >
                          {messagePages[currentPage]}
                        </motion.p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-2.5 md:gap-3 pb-2 sm:pb-3 md:pb-4 lg:pb-5 flex-wrap px-2">
                    {messagePages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDirection(index > currentPage ? "left" : "right");
                          setCurrentPage(index);
                        }}
                        className="focus:outline-none touch-manipulation p-1.5 sm:p-2"
                        aria-label={`Go to page ${index + 1}`}
                      >
                        <motion.div
                          className={`h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full ${
                            index === currentPage
                              ? "bg-[#6b5847]"
                              : "bg-[#8b7355] opacity-40"
                          }`}
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.7 }}
                          animate={{
                            scale: index === currentPage ? 1.4 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>
                    ))}
                  </div>

                  {currentPage > 0 && (
                    <motion.button
                      className="absolute left-1 sm:left-2 md:left-3 lg:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 md:p-3 lg:p-4 rounded-full bg-[#8b7355]/30 hover:bg-[#8b7355]/40 active:bg-[#8b7355]/50 transition-colors touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                      onClick={() => handleSwipe("right")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      aria-label="Previous page"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-[#5a4a3a]"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                  )}

                  {currentPage < messagePages.length - 1 && (
                    <motion.button
                      className="absolute right-1 sm:right-2 md:right-3 lg:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2.5 md:p-3 lg:p-4 rounded-full bg-[#8b7355]/30 hover:bg-[#8b7355]/40 active:bg-[#8b7355]/50 transition-colors touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                      onClick={() => handleSwipe("left")}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      aria-label="Next page"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-[#5a4a3a]"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  )}

                  {currentPage === 0 && (
                    <motion.div
                      className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2 text-[#8b7355] text-xs sm:text-sm md:text-base lg:text-lg font-handwriting opacity-60 flex items-center gap-1.5 sm:gap-2 md:gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="hidden sm:inline">
                        Swipe to continue
                      </span>
                      <span className="sm:hidden">Swipe</span>
                      <motion.svg
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <motion.div
              className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 text-[#8b7355] text-xs sm:text-sm font-handwriting opacity-50"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Click to open
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
