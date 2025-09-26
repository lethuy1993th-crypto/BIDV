import React, { useRef } from 'react';
import type { FormData } from '../types';
import { GOALS, PLATFORMS, AUDIENCES, TONES } from '../constants';

interface InputFormProps {
  formData: FormData;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  onFileRemove: () => void;
}

const FormField: React.FC<{ children: React.ReactNode; label: string; htmlFor: string }> = ({ children, label, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const SelectInput: React.FC<{ name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ name, value, onChange, options }) => (
  <select
    id={name}
    name={name}
    value={value}
    onChange={onChange}
    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-bidv-blue focus:border-bidv-blue sm:text-sm rounded-md shadow-sm"
  >
    {options.map(option => <option key={option}>{option}</option>)}
  </select>
);


export const InputForm: React.FC<InputFormProps> = ({ formData, onFormChange, onSubmit, isLoading, onFileChange, file, onFileRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileRemove();
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-bidv-blue">Tạo nội dung mới</h2>
        <p className="mt-1 text-sm text-gray-600">Cung cấp thông tin để AI tạo ra nội dung phù hợp nhất.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Nội dung" htmlFor="context">
          <textarea
            id="context"
            name="context"
            rows={4}
            value={formData.context}
            onChange={onFormChange}
            className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-bidv-blue focus:border-bidv-blue sm:text-sm rounded-md shadow-sm"
            placeholder="Nhập nội dung chính hoặc mô tả về tệp đính kèm..."
            required={!file}
          />
        </FormField>
        
        <FormField label="Hoặc tải lên tệp dữ liệu" htmlFor="file-upload">
            <div 
                onClick={handleFileSelectClick}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-bidv-blue transition-colors"
            >
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                        <p className="pl-1">Nhấn để tải lên</p>
                    </div>
                    <p className="text-xs text-gray-500">
                        PDF, PNG, JPG, TXT
                    </p>
                </div>
            </div>
             <input id="file-upload" name="file-upload" type="file" className="sr-only" ref={fileInputRef} onChange={onFileChange} accept="image/*,application/pdf,text/plain" />
        </FormField>
        
        {file && (
          <div className="text-sm text-gray-700">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span className="font-medium truncate pr-2">{file.name}</span>
                <button
                    type="button"
                    onClick={handleRemoveClick}
                    className="text-red-600 hover:text-red-800 focus:outline-none flex-shrink-0"
                    aria-label="Remove file"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <FormField label="Mục tiêu bài viết" htmlFor="goal">
                <SelectInput name="goal" value={formData.goal} onChange={onFormChange} options={GOALS} />
            </FormField>
            <FormField label="Nền tảng đăng tải" htmlFor="platform">
                <SelectInput name="platform" value={formData.platform} onChange={onFormChange} options={PLATFORMS} />
            </FormField>
            <FormField label="Đối tượng khách hàng" htmlFor="audience">
                <SelectInput name="audience" value={formData.audience} onChange={onFormChange} options={AUDIENCES} />
            </FormField>
            <FormField label="Phong cách mong muốn" htmlFor="tone">
                <SelectInput name="tone" value={formData.tone} onChange={onFormChange} options={TONES} />
            </FormField>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bidv-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bidv-blue disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
            </>
          ) : 'Tạo nội dung'}
        </button>
      </form>
    </div>
  );
};
