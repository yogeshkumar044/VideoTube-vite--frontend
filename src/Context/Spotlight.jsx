import React from "react";
import { useRef, useState, useEffect } from "react";

const Spotlight = ({ 
  children, 
  className = "", 
  spotlightColor = "rgba(255, 255, 255, 0.15)",
  spotlightSize = 200, // Controls the size of the spotlight
  preserveBackground = false // Option to keep or remove the dark background
}) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    setOpacity(0.8);
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleBlur = () => {
    setIsFocused(false);    
    setOpacity(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setOpacity(0.8);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    setPosition({ x: 0, y: 0 });
  };

  // Reset spotlight position and opacity when mouse leaves the spotlight area
  useEffect(() => {
    const handleDocumentMouseLeave = (e) => {
      if (!divRef.current.contains(e.relatedTarget)) {
        setOpacity(0);
        setPosition({ x: 0, y: 0 });
      }
    };

    document.addEventListener("mouseleave", handleDocumentMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleDocumentMouseLeave);
    };
  }, []);

  // Base classes that will always be applied
  const baseClasses = "relative overflow-hidden";
  
  // Optional classes that can be controlled
  const defaultClasses = preserveBackground ? "rounded-3xl border border-neutral-800 bg-neutral-900 p-8" : "";
  
  // Combine all classes
  const containerClasses = `${baseClasses} ${defaultClasses} ${className}`.trim();

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={containerClasses}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity,
            background: `radial-gradient(circle ${spotlightSize}px at ${position.x}px ${position.y}px, ${spotlightColor}, transparent)`,
        }}
      />
      {children}
    </div>
  );
};

export default Spotlight;