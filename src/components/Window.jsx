import { useState, useRef, useEffect } from 'react';

function Window({ id, title, content, position, zIndex, isMinimized, onClose, onMinimize, onFocus, onPositionChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animState, setAnimState] = useState('appearing');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [slideDir, setSlideDir] = useState('right');
  const appearTimerRef = useRef(null);
  const windowRef = useRef(null);
  const prevMinimizedRef = useRef(false);

  useEffect(() => {
    appearTimerRef.current = setTimeout(() => {
      setAnimState(prev => prev === 'appearing' ? 'idle' : prev);
    }, 300);
    return () => clearTimeout(appearTimerRef.current);
  }, []);

  useEffect(() => {
    if (isMinimized && !prevMinimizedRef.current) {
      prevMinimizedRef.current = true;
    } else if (!isMinimized && prevMinimizedRef.current) {
      setAnimState('restoring');
      const t = setTimeout(() => setAnimState('idle'), 380);
      prevMinimizedRef.current = false;
      return () => clearTimeout(t);
    }
  }, [isMinimized]);

  const handleClose = () => {
    clearTimeout(appearTimerRef.current);
    setAnimState('closing');
    setTimeout(() => onClose(), 300);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    clearTimeout(appearTimerRef.current);
    setAnimState('minimizing');
    setTimeout(() => onMinimize(), 350);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 200;
      onPositionChange({ x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);

  const carouselItems = content.type === 'carousel' ? content.items : [];
  const carouselPrev = (e) => {
    e.stopPropagation();
    setSlideDir('left');
    setCarouselIndex(i => (i - 1 + carouselItems.length) % carouselItems.length);
  };
  const carouselNext = (e) => {
    e.stopPropagation();
    setSlideDir('right');
    setCarouselIndex(i => (i + 1) % carouselItems.length);
  };

  const isHidden = isMinimized && animState === 'idle';

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-lg shadow-2xl overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${animState === 'appearing' ? 'window-appear' : ''
      } ${animState === 'closing' ? 'window-exit pointer-events-none' : ''
      } ${animState === 'minimizing' ? 'window-minimize pointer-events-none' : ''
      } ${animState === 'restoring' ? 'window-restore' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        width: 'min(90vw, 600px)',
        maxHeight: '80vh',
        backgroundColor: '#1e2130',
        border: '1px solid #2e3250',
        display: isHidden ? 'none' : undefined,
      }}
      onClick={onFocus}
      onMouseDown={handleMouseDown}
    >
      <div
        className="px-4 py-2 flex items-center justify-between gap-2"
        style={{ backgroundColor: '#252840', borderBottom: '1px solid #2e3250' }}
      >
        <span className="font-semibold text-sm truncate" style={{ color: '#c8cde8' }}>{title}</span>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleMinimize}
            className="w-6 h-6 rounded flex items-center justify-center text-base font-bold cursor-pointer transition-colors"
            style={{ color: '#8b90a8' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e6b800'; e.currentTarget.style.color = '#1a1200'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b90a8'; }}
          >
            −
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            className="w-6 h-6 rounded flex items-center justify-center text-lg font-bold cursor-pointer transition-colors"
            style={{ color: '#8b90a8' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#c0392b'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b90a8'; }}
          >
            ×
          </button>
        </div>
      </div>

      <div className="window-content p-6 overflow-y-auto max-h-[calc(80vh-40px)]">
        {content.image && (
          <img
            src={content.image}
            alt={content.heading}
            className="w-full h-48 object-cover rounded mb-4"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        )}

        {content.type !== 'carousel' && (
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#dde1f5' }}>{content.heading}</h2>
        )}

        {(content.type === 'prose' || content.type === 'text') && (
          <p className="leading-relaxed" style={{ color: '#9ba3c2' }}>{content.body}</p>
        )}

        {content.type === 'bullet' && (
          <ul className="list-disc list-outside pl-5 space-y-2">
            {content.items.map((item, i) => (
              <li key={i} className="leading-relaxed" style={{ color: '#9ba3c2' }}>{item}</li>
            ))}
          </ul>
        )}

        {content.type === 'numbered' && (
          <>
            {content.intro && (
              <p className="leading-relaxed mb-4" style={{ color: '#9ba3c2' }}>{content.intro}</p>
            )}
            <ol className="list-decimal list-outside pl-5 space-y-3">
              {content.items.map((item, i) => (
                <li key={i} className="leading-relaxed" style={{ color: '#9ba3c2' }}>
                  <span className="font-bold" style={{ color: '#dde1f5' }}>{item.label}</span>
                  {' — '}{item.description}
                </li>
              ))}
            </ol>
          </>
        )}

        {content.type === 'carousel' && carouselItems.length > 0 && (() => {
          const current = carouselItems[carouselIndex];
          return (
            <div className="overflow-hidden">
              <div className="relative flex items-center justify-center mb-3">
                <button
                  onClick={carouselPrev}
                  onMouseDown={e => e.stopPropagation()}
                  className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg transition-colors cursor-pointer shadow"
                  style={{ backgroundColor: '#2e3250', color: '#9ba3c2' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4a5080'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2e3250'; e.currentTarget.style.color = '#9ba3c2'; }}
                >
                  ‹
                </button>

                <div
                  key={carouselIndex}
                  className={`w-full ${slideDir === 'right' ? 'carousel-slide-right' : 'carousel-slide-left'}`}
                >
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-48 object-cover rounded px-10"
                    draggable={false}
                    onDragStart={e => e.preventDefault()}
                  />
                </div>

                <button
                  onClick={carouselNext}
                  onMouseDown={e => e.stopPropagation()}
                  className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg transition-colors cursor-pointer shadow"
                  style={{ backgroundColor: '#2e3250', color: '#9ba3c2' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4a5080'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2e3250'; e.currentTarget.style.color = '#9ba3c2'; }}
                >
                  ›
                </button>
              </div>

              <div className="flex justify-center gap-2 mb-4">
                {carouselItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => {
                      e.stopPropagation();
                      setSlideDir(i > carouselIndex ? 'right' : 'left');
                      setCarouselIndex(i);
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    className="w-2 h-2 rounded-full transition-colors cursor-pointer"
                    style={{ backgroundColor: i === carouselIndex ? '#7b82c0' : '#3a3f60' }}
                  />
                ))}
              </div>

              <div
                key={`text-${carouselIndex}`}
                className={slideDir === 'right' ? 'carousel-slide-right' : 'carousel-slide-left'}
              >
                <h3 className="text-lg font-bold mb-2" style={{ color: '#dde1f5' }}>{current.title}</h3>
                <p className="leading-relaxed" style={{ color: '#9ba3c2' }}>{current.description}</p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default Window;