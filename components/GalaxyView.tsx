
import React, { useState, useRef, useMemo, useEffect } from 'react';
import type { JournalEntry } from '../types';

interface GalaxyViewProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ entries, onSelectEntry }) => {
  const [rotation, setRotation] = useState({ x: -15, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDraggingRef = useRef(false);
  const startCoordsRef = useRef({ x: 0, y: 0 });
  const rotationOnDragStartRef = useRef({ x: 0, y: 0 });
  const initialPinchDistanceRef = useRef(0);
  const zoomOnPinchStartRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [imageSizes, setImageSizes] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startCoordsRef.current = { x: e.clientX, y: e.clientY };
    rotationOnDragStartRef.current = { ...rotation };
    if (e.currentTarget) (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startCoordsRef.current.x;
    const deltaY = e.clientY - startCoordsRef.current.y;
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDraggedRef.current = true;
    }
    const newRotationY = rotationOnDragStartRef.current.y + deltaX * 0.2;
    let newRotationX = rotationOnDragStartRef.current.x - deltaY * 0.2;
    newRotationX = Math.max(-90, Math.min(90, newRotationX)); // Clamp vertical rotation
    setRotation({ x: newRotationX, y: newRotationY });
  };

  const handleMouseUp = (e: React.MouseEvent, entry?: JournalEntry) => {
    isDraggingRef.current = false;
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
    if (!hasDraggedRef.current && entry) {
        onSelectEntry(entry);
    }
  };
  
   const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (containerRef.current) containerRef.current.style.cursor = 'grab';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    hasDraggedRef.current = false;
    if (e.touches.length === 1) {
        isDraggingRef.current = true;
        startCoordsRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        rotationOnDragStartRef.current = { ...rotation };
    } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        initialPinchDistanceRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        zoomOnPinchStartRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - startCoordsRef.current.x;
        const deltaY = e.touches[0].clientY - startCoordsRef.current.y;
        if(Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) hasDraggedRef.current = true;
        const newRotationY = rotationOnDragStartRef.current.y + deltaX * 0.2;
        let newRotationX = rotationOnDragStartRef.current.x - deltaY * 0.2;
        newRotationX = Math.max(-90, Math.min(90, newRotationX));
        setRotation({ x: newRotationX, y: newRotationY });
    } else if (e.touches.length === 2) {
        hasDraggedRef.current = true;
        const currentPinchDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const zoomFactor = currentPinchDistance / initialPinchDistanceRef.current;
        const newZoom = Math.max(0.5, Math.min(zoomOnPinchStartRef.current * zoomFactor, 3));
        setZoom(newZoom);
    }
  };

  const handleTouchEnd = (entry: JournalEntry) => {
    if (!hasDraggedRef.current) {
      onSelectEntry(entry);
    }
    isDraggingRef.current = false;
    initialPinchDistanceRef.current = 0;
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(zoom - e.deltaY * 0.001, 3));
    setZoom(newZoom);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
        el.addEventListener('wheel', handleWheel as any, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel as any);
    }
  }, []);

  useEffect(() => {
    const calculateSizes = () => {
        const isMobile = window.innerWidth < 768;
        // Desktop: 6-10rem, Mobile: 1.5-2.5rem (one quarter)
        const baseSize = isMobile ? 1.5 : 6;
        const randomSize = isMobile ? 1 : 4;
        setImageSizes(
            entries.map(() => Math.random() * randomSize + baseSize)
        );
    };

    calculateSizes();
    window.addEventListener('resize', calculateSizes);
    return () => window.removeEventListener('resize', calculateSizes);
  }, [entries.length]);

  const photoPositions = useMemo(() => {
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    return entries.map(() => {
      let x, y, z;
      do {
          x = (Math.random() - 0.5) * 2 * radius;
          y = (Math.random() - 0.5) * 2 * radius;
          z = (Math.random() - 0.5) * 2 * radius;
      } while (Math.sqrt(x*x + y*y + z*z) > radius);

      const rx = (Math.random() - 0.5) * 90;
      const ry = (Math.random() - 0.5) * 90;
      return { x, y, z, rx, ry };
    });
  }, [entries.length]);

  const stars = useMemo(() => {
    const numStars = 150;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 1.5;
    const colors = ['#C8A2C8', '#FFB7B2', '#E6E6FA', '#DDA0DD', '#DA70D6'];
    return Array.from({ length: numStars }).map(() => {
        let x, y, z;
        do {
            x = (Math.random() - 0.5) * 2 * radius;
            y = (Math.random() - 0.5) * 2 * radius;
            z = (Math.random() - 0.5) * 2 * radius;
        } while (Math.sqrt(x*x + y*y + z*z) > radius);

        return {
            x,
            y,
            z,
            size: Math.random() * 2 + 1, // 1px to 3px
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.5, // 0.5 to 1.0 opacity
            animationDuration: `${Math.random() * 5 + 3}s`, // 3s to 8s
            animationDelay: `${Math.random() * 5}s`,
        };
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab"
      style={{ perspective: `${1200 / zoom}px` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={(e) => handleMouseUp(e)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
        <style>{`
            @keyframes starburst {
                0%, 100% {
                    transform: scale(0.7) rotate(0deg);
                    opacity: 0.6;
                }
                50% {
                    transform: scale(1.3) rotate(15deg);
                    opacity: 1;
                }
            }
            .starburst-star {
                position: relative;
                animation-name: starburst;
                animation-iteration-count: infinite;
                animation-timing-function: ease-in-out;
            }
            .starburst-star::before,
            .starburst-star::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--star-color);
                box-shadow: 0 0 5px 1px var(--star-color);
                border-radius: 2px;
            }
            .starburst-star::before {
                transform: scaleY(0.2); /* Creates a horizontal bar */
            }
            .starburst-star::after {
                transform: scaleX(0.2); /* Creates a vertical bar */
            }
        `}</style>
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        {stars.map((star, index) => (
            <div
                key={`star-${index}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    transform: `translate3d(${star.x}px, ${star.y}px, ${star.z}px)`,
                }}
            >
                <div
                    className="starburst-star"
                    style={{
                        // @ts-ignore
                        '--star-color': star.color,
                        width: `${star.size * 2}px`,
                        height: `${star.size * 2}px`,
                        animationDuration: star.animationDuration,
                        animationDelay: star.animationDelay,
                    }}
                />
            </div>
        ))}
        {entries.map((entry, index) => {
          const pos = photoPositions[index];
          const size = imageSizes[index] || (window.innerWidth < 768 ? 2 : 6);
          const displayImageUrl = entry.imageUrl || `https://media.istockphoto.com/id/178149253/photo/deep-space-background.jpg?s=612x612&w=0&k=20&c=w1hb2H1C-blV918LoG9mGB02nJY6cLJpR5Szfg7sLqE=`;
          return (
            <div
              key={entry.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-hidden shadow-lg shadow-purple-400/30 border-2 border-white/50 transition-transform duration-300 hover:scale-110"
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) rotateX(${pos.rx}deg) rotateY(${pos.ry}deg)`,
                width: `${size}rem`,
                height: `${size}rem`,
              }}
              onMouseUp={(e) => handleMouseUp(e, entry)}
              onTouchEnd={() => handleTouchEnd(entry)}
            >
              <img
                src={displayImageUrl}
                alt="Journal entry"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
