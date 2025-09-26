import React, { useState, useCallback, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { Header } from './components/Header';
import { HistoryPanel } from './components/HistoryPanel';
import { generateContent } from './services/geminiService';
import type { FormData, GenerationResult, HistoryItem, HistoryInput } from './types';

const HISTORY_STORAGE_KEY = 'bidvContentAI_history';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    context: '',
    goal: 'Giới thiệu dịch vụ',
    platform: 'Facebook',
    audience: 'Khách hàng cá nhân',
    tone: 'Gần gũi',
  });
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
  }, []);
  
  const handleToggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleReuseInputs = useCallback((inputs: HistoryInput) => {
    const { fileName, ...formInputs } = inputs;
    setFormData(formInputs);
    setFile(null);
    setResult(null);
    setError(null);
    setShowHistory(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.context && !file) {
      setError("Vui lòng nhập nội dung hoặc tải lên một tệp.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await generateContent(formData, file);
      setResult(generatedResult);

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString() + Math.random(),
        timestamp: Date.now(),
        inputs: {
            ...formData,
            fileName: file?.name,
        },
        result: generatedResult,
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray font-sans text-dark-gray">
      <Header historyCount={history.length} onToggleHistory={handleToggleHistory} />
       <HistoryPanel
        isOpen={showHistory}
        history={history}
        onClose={handleToggleHistory}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
        onReuse={handleReuseInputs}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <InputForm
                formData={formData}
                onFormChange={handleFormChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onFileChange={handleFileChange}
                file={file}
                onFileRemove={handleFileRemove}
              />
              <OutputDisplay
                result={result}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
          <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} BIDV Content AI. Powered by Google Gemini.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;