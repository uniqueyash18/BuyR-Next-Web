'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedGridProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

const AnimatedGrid: React.FC<AnimatedGridProps> = ({ 
  children, 
  staggerDelay = 0.05,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={gridRef} 
      className={`grid gap-4 ${className}`}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            className: `${(child as React.ReactElement<any>).props.className || ''} ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            } transition-all duration-500 ease-out`,
            style: {
              ...(child as React.ReactElement<any>).props.style,
              transitionDelay: isVisible ? `${index * staggerDelay}s` : '0s',
            },
          });
        }
        return child;
      })}
    </div>
  );
};

export default AnimatedGrid; 