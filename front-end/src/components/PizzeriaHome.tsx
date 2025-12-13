import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface Props {
  onNavigate: (page: string) => void;
}

export function PizzeriaHome({ onNavigate }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating pizza ingredients */}
        <div 
          className="absolute opacity-10 animate-float"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="50" fill="#dc2626" opacity="0.3"/>
            <circle cx="40" cy="45" r="8" fill="#8B0000"/>
            <circle cx="70" cy="50" r="8" fill="#8B0000"/>
            <circle cx="55" cy="70" r="8" fill="#8B0000"/>
          </svg>
        </div>
        
        <div 
          className="absolute opacity-10 animate-float-delayed"
          style={{
            top: '60%',
            right: '15%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="#dc2626" opacity="0.3"/>
          </svg>
        </div>

        <div 
          className="absolute opacity-10 animate-float"
          style={{
            bottom: '20%',
            left: '20%',
            transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * 0.025}px)`
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <ellipse cx="40" cy="40" rx="30" ry="15" fill="#228B22" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Diagonal split container */}
      <div className="relative min-h-screen">
        {/* Left side - Menu */}
        <div 
          className="absolute inset-0 clip-diagonal-left group hover:scale-105 transition-transform duration-700 cursor-pointer overflow-hidden"
          onClick={() => onNavigate('menu')}
          style={{
            clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0 100%)'
          }}
        >
          <img 
            src="/images/notremenu.jpg" 
            alt="Notre Menu" 
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ objectPosition: 'center center' }}
          />
          <div className="relative h-full flex flex-col items-center justify-center text-white p-4 md:p-8 transform group-hover:scale-105 transition-transform duration-500 bg-black/40" style={{ paddingRight: '45%' }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 font-heading animate-fade-in">Notre Menu</h2>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-red-600 hover:bg-red-50 border-white hover:border-red-100 font-bold text-base md:text-lg px-6 py-4 md:px-8 md:py-6 animate-fade-in-delayed-2"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('menu');
              }}
            >
              Voir la carte
            </Button>
          </div>
        </div>

        {/* Right side - Order */}
        <div 
          className="absolute inset-0 clip-diagonal-right group hover:scale-105 transition-transform duration-700 cursor-pointer overflow-hidden"
          onClick={() => onNavigate('contact')}
          style={{
            clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)'
          }}
        >
          <img 
            src="/images/commander.jpg" 
            alt="Commander" 
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ objectPosition: 'center center' }}
          />
          <div className="relative h-full flex flex-col items-center justify-center text-white p-4 md:p-8 transform group-hover:scale-105 transition-transform duration-500" style={{ paddingLeft: '45%' }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 font-heading animate-fade-in">Commander</h2>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-base md:text-lg px-6 py-4 md:px-8 md:py-6 animate-fade-in-delayed-2"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('contact');
              }}
            >
              Passer commande
            </Button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in 1s ease-out 0.6s forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
