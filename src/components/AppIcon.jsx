import { useState, useRef } from 'react';

function AppIcon({ name, icon, onDoubleClick }) {
  const [isSelected, setIsSelected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const clickTimeout = useRef(null);

  const handleClick = () => {
    if (clickTimeout.current) {
      // Double click detected
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      onDoubleClick();
    } else {
      setIsSelected(true);
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
      }, 300);
    }
  };

  const handleBlur = () => {
    setIsSelected(false);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseMove = (e) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <div className="relative w-28 h-full">
      <div
        className={`flex flex-col items-center justify-start w-full h-full p-2 cursor-pointer rounded transition-colors ${
          isSelected ? 'bg-blue-500/30' : 'hover:bg-white/10'
        }`}
        onClick={handleClick}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        tabIndex={0}
      >
        <img 
          src={icon} 
          alt={name}
          className="w-16 h-16 mb-2 object-contain pointer-events-none select-none flex-shrink-0"
          draggable={false}
        />
        <span 
          className="text-white text-xs text-center font-semibold select-none break-words w-full overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8), 1px -1px 2px rgba(0, 0, 0, 0.8), -1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}
        >
          {name}
        </span>
      </div>
      
      {/* linux tooltip */}
      {showTooltip && (
        <div 
          className="linux-tooltip"
          style={{
            position: 'fixed',
            left: `${mousePos.x + 10}px`,
            top: `${mousePos.y + 10}px`,
          }}
        >
          Double-click me to view
        </div>
      )}
    </div>
  );
}

export default AppIcon;