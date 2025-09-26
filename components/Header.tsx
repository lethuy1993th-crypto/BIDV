import React from 'react';

interface HeaderProps {
    historyCount: number;
    onToggleHistory: () => void;
}

const BIDVLogo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="#00539f"/>
    <path d="M60 18L95.25 82.5H24.75L60 18Z" fill="#00a651"/>
    <path d="M60 38.6364L81.1875 74.3182H38.8125L60 38.6364Z" fill="white"/>
  </svg>
);


export const Header: React.FC<HeaderProps> = ({ historyCount, onToggleHistory }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <BIDVLogo />
            <h1 className="text-2xl font-bold text-bidv-blue">
              BIDV Content AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="hidden md:block text-md text-gray-600">Công cụ hỗ trợ sáng tạo nội dung</p>
             <button 
                onClick={onToggleHistory}
                className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bidv-blue"
                aria-label="View history"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {historyCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {historyCount > 9 ? '9+' : historyCount}
                    </span>
                )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};