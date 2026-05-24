import { useState, useCallback, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'motion/react';
import './ShinyText.css';

const ShinyText = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0
}: {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const backgroundPosition = useMotionValue('150% center');
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useAnimationFrame(time => {
    if (disabled || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    elapsedRef.current += deltaTime;

    let p: number;

    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration;
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        p = (cycleTime / animationDuration) * 100;
        p = directionRef.current === 1 ? p : 100 - p;
      } else if (cycleTime < cycleDuration) {
        p = directionRef.current === 1 ? 100 : 0;
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration;
        p = 100 - (reverseTime / animationDuration) * 100;
        p = directionRef.current === 1 ? p : 100 - p;
      } else {
        p = directionRef.current === 1 ? 0 : 100;
      }
    } else {
      const cycleDuration = animationDuration + delayDuration;
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < animationDuration) {
        p = (cycleTime / animationDuration) * 100;
        p = directionRef.current === 1 ? p : 100 - p;
      } else {
        p = directionRef.current === 1 ? 100 : 0;
      }
    }

    // Check RTL live on every frame
    const isRTL = document.documentElement.dir === 'rtl';

    // LTR: shine sweeps left-to-right (150% → -50%)
    // RTL: shine sweeps right-to-left (-50% → 150%)
    const pos = isRTL
      ? -50 + p * 2
      : 150 - p * 2;

    backgroundPosition.set(`${pos}% center`);
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <motion.span
      className={`shiny-text ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;