import { useState } from 'react';

function TaskBar({ windows, minimizedIds, onTaskbarClick, itemRefs }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div
      className="flex items-center justify-center px-4 gap-2 flex-shrink-0"
      style={{
        height: '60px',
        backgroundColor: '#0f111a',
        borderTop: '1px solid #2e3250',
        zIndex: 9998,
      }}
    >
      {windows.map(win => {
        const isMinimized = minimizedIds.has(win.id);
        const label = win.windowTitle || win.name;
        const isHovered = hoveredId === win.id;

        return (
          <div
            key={win.id}
            className="relative flex items-center justify-center"
          >
            {isHovered && (
              <div
                className="absolute bottom-full mb-3 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap pointer-events-none taskbar-tooltip"
                style={{
                  backgroundColor: '#252840',
                  color: '#dde1f5',
                  border: '1px solid #3a3f65',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  letterSpacing: '0.01em',
                  lineHeight: '1.4',
                }}
              >
                {label}
              </div>
            )}

            <button
              ref={el => { itemRefs.current[win.id] = el; }}
              onClick={() => onTaskbarClick(win.id)}
              onMouseEnter={() => setHoveredId(win.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center justify-center rounded cursor-pointer transition-all flex-shrink-0"
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: isHovered ? '#2e3250' : isMinimized ? 'transparent' : '#252840',
                border: isMinimized ? '1px solid #2a2d45' : '1px solid #3a3f65',
                opacity: isMinimized && !isHovered ? 0.5 : 1,
              }}
            >
              <img
                src={win.icon}
                alt={label}
                className="w-7 h-7 object-contain"
                draggable={false}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default TaskBar;