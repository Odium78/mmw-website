import AppIcon from './AppIcon';

function Desktop({ apps, onAppDoubleClick }) {
  return (
    <div 
      className="w-full h-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/src/assets/placeholderWallpaper.png)' }}
    >
      {/* App Icons Grid - Flows vertically, wraps to new column */}
      {/* Outer div holds padding so the grid's height is unaffected by it */}
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
      
      {/* Recycle Bin - Bottom Right */}
      <div className="absolute bottom-6 right-6">
        <AppIcon
          name="Recycle Bin"
          icon="/src/assets/bin.png"
          onDoubleClick={() => {}}
        />
      </div>
    </div>
  );
}

export default Desktop;