import AppIcon from './AppIcon';

import wallpaper from '../assets/placeholderWallpaper.png';
import binIcon   from '../assets/bin.png';

function Desktop({ apps, onAppDoubleClick }) {
  return (
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div
        className="p-6 box-border"
        style={{ height: '100%' }}
      >
        <div
          className="grid content-start overflow-hidden h-full"
          style={{
            gap: '0.5rem 0.75rem',
            gridTemplateRows: 'repeat(auto-fill, 9.5rem)',
            gridAutoFlow: 'column',
            gridAutoColumns: '7rem',
          }}
        >
          {apps.map(app => (
            <AppIcon
              key={app.id}
              name={app.name}
              icon={app.icon}
              onDoubleClick={() => onAppDoubleClick(app)}
            />
          ))}
        </div>
      </div>

      {/* recycle bin */}
      <div className="absolute bottom-6 right-6">
        <AppIcon
          name="Recycle Bin"
          icon={binIcon}
          onDoubleClick={() => {}}
        />
      </div>
    </div>
  );
}

export default Desktop;