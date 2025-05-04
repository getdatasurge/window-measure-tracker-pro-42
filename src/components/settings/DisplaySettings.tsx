
import React from 'react';

interface DisplaySettingsProps {
  theme: string;
  setTheme: (theme: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  density: string;
  setDensity: (density: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  theme,
  setTheme,
  accentColor,
  setAccentColor,
  density,
  setDensity,
  fontSize,
  setFontSize
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Display Settings</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <p className="text-xs text-gray-500 mb-3">Choose your preferred visual theme</p>
          
          <div className="flex gap-4">
            <button 
              className={`w-16 h-10 rounded-md border-2 flex items-center justify-center ${theme === 'light' ? 'border-wintrack-green' : 'border-transparent'}`}
              onClick={() => setTheme('light')}
            >
              <div className="w-12 h-6 bg-gray-100 rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" stroke="black" strokeWidth="2"/>
                  <path d="M12 2V4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 20V22" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 12L2 12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 12L20 12" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19.7778 4.22266L17.5558 6.25424" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4.22217 4.22266L6.44418 6.25424" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6.44434 17.5557L4.22211 19.7779" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19.7778 19.7773L17.5558 17.5551" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </button>
            
            <button 
              className={`w-16 h-10 rounded-md border-2 flex items-center justify-center ${theme === 'dark' ? 'border-wintrack-green' : 'border-transparent'}`}
              onClick={() => setTheme('dark')}
            >
              <div className="w-12 h-6 bg-gray-800 rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0794 20.7461C8.41087 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.5891 3.25391 13.9206C2.88188 12.252 2.99272 10.5121 3.57346 8.9043C4.1542 7.29651 5.18083 5.88737 6.53321 4.84175C7.88559 3.79614 9.5078 3.15731 11.21 3C10.2134 4.34827 9.73387 6.00945 9.85856 7.68141C9.98324 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1414C17.9906 14.2661 19.6517 13.7866 21 12.79V12.79Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
            
            <button 
              className={`w-16 h-10 rounded-md border-2 flex items-center justify-center ${theme === 'system' ? 'border-wintrack-green' : 'border-transparent'}`}
              onClick={() => setTheme('system')}
            >
              <div className="w-12 h-6 bg-gray-200 rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 12L23 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2V1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 23V22" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 20L19 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 4L19 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20L5 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4L5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 12L2 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Color Accent</label>
          <p className="text-xs text-gray-500 mb-3">Choose your accent color</p>
          
          <div className="flex gap-4">
            <button 
              className={`w-8 h-8 rounded-full bg-green-500 ${accentColor === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
              onClick={() => setAccentColor('green')}
            ></button>
            <button 
              className={`w-8 h-8 rounded-full bg-blue-500 ${accentColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
              onClick={() => setAccentColor('blue')}
            ></button>
            <button 
              className={`w-8 h-8 rounded-full bg-purple-500 ${accentColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
              onClick={() => setAccentColor('purple')}
            ></button>
            <button 
              className={`w-8 h-8 rounded-full bg-orange-500 ${accentColor === 'orange' ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
              onClick={() => setAccentColor('orange')}
            ></button>
            <button 
              className={`w-8 h-8 rounded-full bg-red-500 ${accentColor === 'red' ? 'ring-2 ring-offset-2 ring-red-500' : ''}`}
              onClick={() => setAccentColor('red')}
            ></button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Display Density</label>
          <p className="text-xs text-gray-500 mb-3">Adjust the spacing between elements</p>
          
          <div className="flex gap-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="density" 
                className="mr-2 text-wintrack-green focus:ring-wintrack-green" 
                checked={density === 'compact'}
                onChange={() => setDensity('compact')}
              />
              <span>Compact</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="density" 
                className="mr-2 text-wintrack-green focus:ring-wintrack-green" 
                checked={density === 'regular'}
                onChange={() => setDensity('regular')}
              />
              <span>Regular</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="density" 
                className="mr-2 text-wintrack-green focus:ring-wintrack-green" 
                checked={density === 'comfortable'}
                onChange={() => setDensity('comfortable')}
              />
              <span>Comfortable</span>
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
          <p className="text-xs text-gray-500 mb-3">Adjust text size throughout the application</p>
          
          <div className="flex items-center gap-4">
            <span className="text-xs">Small</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-base">Large</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
