import { useState, useRef } from 'react';
import Desktop from './components/Desktop';
import Window from './components/Window';
import Taskbar from './components/TaskBar';

const TASKBAR_HEIGHT = 60;

const appData = [
  {
    id: 'definition',
    name: 'Definition',
    icon: './src/assets/def.png',
    content: {
      heading: 'Definition of Mathematics',
      type: 'text',
      body: 'Mathematics is fundamental to the physical and biological sciences, engineering, and Information Technology, economics, and increasingly to the social sciences.'
    }
  },
  {
    id: 'where-is-math',
    name: 'Where is mathematics',
    icon: './src/assets/wim.png',
    content: {
      heading: 'Where is Mathematics',
      type: 'text',
      body: 'Many patterns and occurrences exist in nature, in our world, and in our life. Mathematics helps make sense of these patterns and occurrences.'
    }
  },
  {
    id: 'roles',
    name: 'Roles of Mathematics',
    icon: './src/assets/rim.png',
    content: {
      heading: 'What Role Does Mathematics Play in Our World',
      type: 'bullet',
      items: [
        'Mathematics helps organize patterns and regularities in nature.',
        'Mathematics helps predict the behavior of natural phenomena in the world.',
        'Mathematics helps control nature and occurrences in the world for our own ends.',
        'Mathematics has numerous applications in the world making it indispensable.'
      ]
    }
  },
  {
    id: 'patterns',
    name: 'Patterns and Numbers',
    icon: './src/assets/pan.png',
    content: {
      heading: 'Patterns and Numbers in Nature and the World',
      type: 'text',
      body: 'Patterns in nature are visible regularities of form found in the natural world and can also be seen in the universe. These patterns are not just to be admired — they are vital clues to the rules that govern natural processes.'
    }
  },
  {
    id: 'importance',
    name: 'Importance of Mathematics',
    icon: './src/assets/iom.png',
    content: {
      heading: 'Importance of Mathematics in Education',
      type: 'numbered',
      intro: 'Mathematics holds a unique position in school curricula and higher education. Its importance can be explained as follows:',
      items: [
        { label: 'Development of Logical Thinking', description: 'It trains the brain to reason, analyze, and draw conclusions.' },
        { label: 'Foundation for Science & Technology', description: 'All scientific discoveries, from space exploration to medical advancements, rely on mathematics.' },
        { label: 'Problem-Solving Skills', description: 'It equips learners with strategies to solve real-life problems.' },
        { label: 'Preparation for Careers', description: 'Professions in engineering, IT, finance, data science, and research require strong mathematical knowledge.' },
        { label: 'Everyday Utility', description: 'From budgeting household expenses to measuring ingredients in cooking, mathematics is used daily.' }
      ]
    }
  },
  {
    id: 'examples-in-nature',
    name: 'Examples of Mathematics',
    windowTitle: 'Examples of Mathematics in Nature',
    icon: './src/assets/eom.png',
    content: {
      heading: 'Examples of Mathematics in Nature',
      type: 'carousel',
      items: [
        {
          title: 'Concentric Circle',
          image: './src/assets/conc.png',
          description: 'Concentric circles represent sets, layers, or systems that are organized around a common center, where each circle shows a different level, distance, or scope but is still related to the same core.'
        },
        {
          title: 'Fern Leaf Pattern',
          image: './src/assets/fern.png',
          description: 'The fern leaf pattern is a fractal pattern, where the overall shape is made up of smaller parts that look similar to the whole.'
        },
        {
          title: 'Honeycomb Pattern',
          image: './src/assets/honey.png',
          description: 'The honeycomb pattern represents hexagonal tiling and optimization, showing how mathematics finds the most efficient way to divide space with equal shapes and minimal material.'
        },
        {
          title: 'Sunflower Pattern',
          image: './src/assets/sunflwr.png',
          description: 'The sunflower pattern represents Fibonacci numbers and spiral geometry, showing how mathematics helps nature arrange objects efficiently to save space and maximize growth.'
        },
        {
          title: 'Peacock Pattern',
          image: './src/assets/peac.png',
          description: 'The peacock pattern represents symmetry, balance, and repetition. It shows how shapes can be arranged evenly around a center using geometric symmetry, which is used in art, design, and architecture.'
        }
      ]
    }
  }
];

function App() {
  const [windows, setWindows] = useState([]);
  const [minimizedIds, setMinimizedIds] = useState(new Set());
  const [highestZIndex, setHighestZIndex] = useState(1);
  const taskbarItemRefs = useRef({});

  const openWindow = (app) => {
    const existingWindow = windows.find(w => w.id === app.id);
    if (existingWindow) {
      if (minimizedIds.has(app.id)) {
        restoreWindow(app.id);
      } else {
        bringToFront(app.id);
      }
      return;
    }

    const offset = windows.length * 30;
    const windowWidth = Math.min(window.innerWidth * 0.9, 600);
    const windowHeight = Math.min((window.innerHeight - TASKBAR_HEIGHT) * 0.8, 500);
    const centeredX = Math.round((window.innerWidth - windowWidth) / 2) + offset;
    const centeredY = Math.round((window.innerHeight - TASKBAR_HEIGHT - windowHeight) / 2) + offset;

    const newWindow = {
      ...app,
      zIndex: highestZIndex + 1,
      position: { x: centeredX, y: centeredY }
    };

    setWindows(prev => [...prev, newWindow]);
    setHighestZIndex(prev => prev + 1);
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setMinimizedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const minimizeWindow = (id) => {
    setMinimizedIds(prev => new Set([...prev, id]));
  };

  const restoreWindow = (id) => {
    setMinimizedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    bringToFront(id);
  };

  const bringToFront = (id) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(prev => prev + 1);
  };

  const updateWindowPosition = (id, position) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  };

  const handleTaskbarClick = (id) => {
    if (minimizedIds.has(id)) {
      restoreWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative">
      <div className="flex-1 min-h-0">
        <Desktop apps={appData} onAppDoubleClick={openWindow} />
      </div>

      <Taskbar
        windows={windows}
        minimizedIds={minimizedIds}
        onTaskbarClick={handleTaskbarClick}
        itemRefs={taskbarItemRefs}
      />

      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.windowTitle || win.name}
          content={win.content}
          position={win.position}
          zIndex={win.zIndex}
          isMinimized={minimizedIds.has(win.id)}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
          onPositionChange={(pos) => updateWindowPosition(win.id, pos)}
        />
      ))}
    </div>
  );
}

export default App;