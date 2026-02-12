import React, { useState, useEffect } from "react";

/**
 * HeartShower – A falling hearts animation for Valentine's Day.
 * Customizable: number of hearts, speed, colors, and wind effect.
 */
const HeartShower = ({
  heartCount = 30,
  heartColor = "#ff69b4",
  secondaryColor = "#ff1493",
  windSpeed = 0.2,
  minSize = 20,
  maxSize = 50,
  fallSpeed = 2,
}) => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Initialize hearts with random positions and properties
    const initialHearts = Array.from({ length: heartCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      y: Math.random() * -20 - 20, // start above viewport (vh)
      size: Math.random() * (maxSize - minSize) + minSize,
      speed: Math.random() * fallSpeed + 1.5,
      sway: Math.random() * 0.8 + 0.2, // horizontal drift factor
      color: Math.random() > 0.5 ? heartColor : secondaryColor,
      rotation: Math.random() * 30 - 15, // initial slight rotation
    }));
    setHearts(initialHearts);
  }, [heartCount, heartColor, secondaryColor, maxSize, minSize, fallSpeed]);

  useEffect(() => {
    let animationFrameId;

    const updateHearts = () => {
      setHearts((prevHearts) =>
        prevHearts.map((heart) => {
          // Move downward
          let newY = heart.y + heart.speed * 0.1; // 0.1 factor for smoother per-frame movement
          // Add horizontal wind/sway
          let newX = heart.x + windSpeed * heart.sway * 0.1;

          // Reset when heart leaves bottom
          if (newY > 110) {
            newY = -10;
            newX = Math.random() * 100;
          }

          // Keep within viewport bounds (with soft edges)
          if (newX > 100) newX = 0;
          if (newX < 0) newX = 100;

          return {
            ...heart,
            x: newX,
            y: newY,
            rotation: heart.rotation + 0.1, // subtle rotation on fall
          };
        })
      );

      animationFrameId = requestAnimationFrame(updateHearts);
    };

    animationFrameId = requestAnimationFrame(updateHearts);

    return () => cancelAnimationFrame(animationFrameId);
  }, [windSpeed]);

  return (
    <div style={styles.container}>
      {/* Romantic message overlay */}
      {/* <div style={styles.messageOverlay}>
        <h1 style={styles.title}>Happy Valentine's Day</h1>
        <p style={styles.subtitle}>You make my heart flutter</p>
      </div> */}

      {/* Heart shower canvas */}
      <div style={styles.heartCanvas}>
        {hearts.map((heart) => (
          <div
            key={heart.id}
            style={{
              ...styles.heart,
              left: `${heart.x}vw`,
              top: `${heart.y}vh`,
              fontSize: `${heart.size}px`,
              color: heart.color,
              transform: `rotate(${heart.rotation}deg)`,
              textShadow: `0 0 10px ${heart.color}80`, // subtle glow
            }}
          >
            ❤︎⁠
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    // position: "relative",
    width: "100vw",
    // height: "100vh",
    overflow: "hidden",
    // background: "linear-gradient(145deg, #ffe6f0 0%, #ffd9e8 100%)",
    // margin: 0,
    // padding: 0,
    // fontFamily:
    //   '"Segoe UI", "Arial", "Helvetica Neue", sans-serif',
  },
  messageOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: 10,
    overflow: "hidden",
    color: "#b30059",
    backgroundColor: "rgba(255, 240, 245, 0.7)",
    padding: "40px 60px",
    borderRadius: "20px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 10px 30px rgba(255, 105, 180, 0.3)",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    pointerEvents: "none",
    animation: "fadeIn 2s ease-out",
  },
  title: {
    fontSize: "clamp(2rem, 8vw, 4.5rem)",
    margin: 0,
    fontWeight: 700,
    letterSpacing: "4px",
    textShadow: "2px 2px 0 rgba(255,255,255,0.8)",
  },
  subtitle: {
    fontSize: "clamp(1rem, 4vw, 1.8rem)",
    margin: "20px 0 0",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#80004c",
  },
  heartCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 20,
    pointerEvents: "none", // allow clicking through to overlay if needed
  },
  heart: {
    position: "absolute",
    userSelect: "none",
    transition: "transform 0.2s ease-out", // smooth rotation
    animation: "float 4s ease-in-out infinite", // gentle float effect
    opacity: 0.9,
    filter: "drop-shadow(0 5px 5px rgba(0,0,0,0.1))",
  },
};

// Inject keyframe animations into the document head
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -40%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
`;
document.head.appendChild(styleSheet);

// Example usage: wrap in a router or just render directly
export default function App() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <HeartShower />
    </div>
  );
}
