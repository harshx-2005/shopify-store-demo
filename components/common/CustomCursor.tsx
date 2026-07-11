"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    // Slow follower effect for the outer ring
    let animationFrameId: number;
    const updateRing = () => {
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Adjust this factor to change follow speed (e.g. 0.15 is smooth)
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };
    animationFrameId = requestAnimationFrame(updateRing);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [position]);

  useEffect(() => {
    const addHoverClass = () => setIsHovered(true);
    const removeHoverClass = () => setIsHovered(false);

    const updateHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, input[type="submit"], input[type="button"], [role="button"], .clickable-item'
      );
      
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", addHoverClass);
        el.addEventListener("mouseleave", removeHoverClass);
      });
    };

    // Initial setup
    updateHoverListeners();

    // Create a MutationObserver to observe DOM changes and bind elements added dynamically later
    const observer = new MutationObserver(() => {
      updateHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const clickables = document.querySelectorAll(
        'a, button, input[type="submit"], input[type="button"], [role="button"], .clickable-item'
      );
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", addHoverClass);
        el.removeEventListener("mouseleave", removeHoverClass);
      });
    };
  }, []);

  if (isHidden) return null;

  return (
    <div className={isHovered ? "custom-cursor-hover" : ""}>
      <div
        className="custom-cursor"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="custom-cursor-ring"
        style={{ left: `${ringPosition.x}px`, top: `${ringPosition.y}px` }}
      />
    </div>
  );
}
