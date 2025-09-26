import React, { useState, useMemo } from 'react';
import type { HistoryItem, HistoryInput } from '../types';

const useCopyToClipboard = (): [boolean, (text: string) => void] => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        if (isCopied) return;
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return [isCopied, copyToClipboard];
};

const HistoryItemCard: React.FC<{
    item: HistoryItem;
    onReuse: (inputs: HistoryInput) => void;
    onDelete: (id: string) => void;
}> = ({ item, onReuse, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [postCopied, copyPost] = useCopyToClipboard();
    const [titleCopied, copyTitle] = useCopyToClipboard();
    const [hashtagsCopied, copyHashtags] = useCopyToClipboard();

    const formattedDate = useMemo(() => new Date(item.timestamp).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }), [item.timestamp]);
    
    const hashtagsText = item.result.hashtags.join(' ');

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="pr-4">
                    <p className="font-bold text-bidv-blue break-words">{item.result.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{formattedDate} &middot; {item.inputs.platform}</p>
                </div>
                <button className="p-1 text-gray-500 hover:text-bidv-blue flex-shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div>
                        <h5 className="text-sm font-semibold text-gray-600 mb-2">Thông số đã dùng:</h5>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-800">
                           <p><strong>Mục tiêu:</strong> {item.inputs.goal}</p>
                           <p><strong>Nền tảng:</strong> {item.inputs.platform}</p>
                           <p><strong>Đối tượng:</strong> {item.inputs.audience}</p>
                           <p><strong>Phong cách:</strong> {item.inputs.tone}</p>
                           {item.inputs.fileName && <p className="col-span-2"><strong>Tệp:</strong> {item.inputs.fileName}</p>}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <ResultItem title="Tiêu đề" text={item.result.title} isCopied={titleCopied} onCopy={copyTitle} isTitle/>
                        <ResultItem title="Nội dung" text={item.result.post} isCopied={postCopied} onCopy={copyPost} />
                        <ResultItem title="Hashtags" text={hashtagsText} isCopied={hashtagsCopied} onCopy={copyHashtags} />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <ActionButton onClick={() => onReuse(item.inputs)}>Sử dụng lại</ActionButton>
                        <ActionButton onClick={() => onDelete(item.id)} isDestructive>Xóa</ActionButton>
                    </div>
                </div>
            )}
        </div>
    );
};

const ResultItem: React.FC<{title: string; text: string; isCopied: boolean; onCopy: (text: string) => void; isTitle?: boolean}> = ({ title, text, isCopied, onCopy, isTitle }) => (
    <div className="bg-gray-50 p-3 rounded-md">
        <div className="flex justify-between items-center mb-1">
            <h6 className="text-xs font-bold text-gray-500 uppercase">{title}</h6>
            <button onClick={() => onCopy(text)} className="text-gray-400 hover:text-bidv-blue p-1">
                {isCopied ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-bidv-green" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
            </button>
        </div>
        <p className={`text-sm text-gray-800 whitespace-pre-wrap ${isTitle && 'font-bold'}`}>{text}</p>
    </div>
);

const ActionButton: React.FC<{onClick: () => void; children: React.ReactNode; isDestructive?: boolean}> = ({ onClick, children, isDestructive }) => (
    <button onClick={onClick} className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${isDestructive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-100 text-bidv-blue hover:bg-blue-200'}`}>{children}</button>
);


interface HistoryPanelProps {
    history: HistoryItem[];
    isOpen: boolean;
    onClose: () => void;
    onReuse: (inputs: HistoryInput) => void;
    onDelete: (id: string) => void;
    onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose, onReuse, onDelete, onClearAll }) => {
    if (!isOpen) return null;

    const handleClearConfirm = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử không? Hành động này không thể hoàn tác.')) {
            onClearAll();
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity animate-fade-in" onClick={onClose} aria-hidden="true"></div>
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-light-gray shadow-xl z-50 flex flex-col transform transition-transform animate-slide-in">
                <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 flex-shrink-0">
                    <h3 className="text-xl font-bold text-bidv-blue">Lịch sử</h3>
                    <div className="flex items-center space-x-2">
                        {history.length > 0 && (
                            <button onClick={handleClearConfirm} className="text-sm text-red-600 hover:text-red-800 hover:bg-red-100 px-2 py-1 rounded-md transition-colors">Xóa tất cả</button>
                        )}
                        <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors" aria-label="Close history">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="font-semibold text-lg text-gray-700">Lịch sử trống</p>
                            <p className="text-sm">Các nội dung bạn tạo sẽ được lưu tại đây.</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <HistoryItemCard key={item.id} item={item} onReuse={onReuse} onDelete={onDelete} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};