
import React, { useState, useEffect } from 'react';
import type { GenerationResult } from '../types';

interface OutputDisplayProps {
  result: GenerationResult | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <svg className="animate-spin h-12 w-12 text-bidv-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-semibold text-gray-700">AI đang sáng tạo...</p>
        <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát.</p>
    </div>
);

const CopyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const ResultCard: React.FC<{ title: string; children: React.ReactNode; textToCopy: string }> = ({ title, children, textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg relative">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-gray-800">{title}</h4>
                <button 
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bidv-blue"
                    aria-label={`Copy ${title}`}
                >
                    {copied ? <CheckIcon className="h-5 w-5 text-bidv-green" /> : <CopyIcon className="h-5 w-5" />}
                </button>
            </div>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {children}
            </div>
        </div>
    );
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ result, isLoading, error }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 h-full min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-bidv-blue mb-4">Kết quả từ AI</h2>
      <div className="flex-grow bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-inner">
        {isLoading && <LoadingSpinner />}
        {error && <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
        {result && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            <ResultCard title="Tiêu đề" textToCopy={result.title}>
                <p className="font-bold text-lg">{result.title}</p>
            </ResultCard>
            <ResultCard title="Nội dung bài viết" textToCopy={result.post}>
                <p>{result.post}</p>
            </ResultCard>
            <ResultCard title="Hashtags" textToCopy={result.hashtags.join(' ')}>
                <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-bidv-blue text-xs font-medium rounded-full">{tag}</span>
                    ))}
                </div>
            </ResultCard>
          </div>
        )}
        {!isLoading && !error && !result && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="mt-4 text-lg font-semibold text-gray-700">Nội dung sẽ xuất hiện ở đây</p>
                <p className="text-sm text-gray-500">Điền thông tin và nhấn "Tạo nội dung" để bắt đầu.</p>
            </div>
        )}
      </div>
    </div>
  );
};
