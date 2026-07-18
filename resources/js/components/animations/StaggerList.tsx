import { ReactNode, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  selector?: string; // Class name or element to target inside the container
}

export function StaggerList({ children, className = '', staggerDelay = 0.1, selector = '>*' }: StaggerListProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const targets = selector === '>*' && container.current ? container.current.children : selector;
    
    gsap.from(targets, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: staggerDelay,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }, { scope: container });

  return (
    <div ref={container} className={`w-full ${className}`}>
      {children}
    </div>
  );
}
