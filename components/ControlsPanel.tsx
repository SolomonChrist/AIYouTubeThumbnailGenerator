import React from 'react';
import type { ControlsPanelProps } from '../types';
import { ImageUploader } from './ImageUploader';
import { GenerateButton } from './GenerateButton';

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  appState,
  setAppState,
  onFileSelect,
  onGenerateClick,
}) => {
  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-secondary">1. Your Google AI API Key</h2>
        <p className="text-sm text-gray-500 mb-2">
          This app uses your own key. It's not stored or shared.
        </p>
        <input
          type="password"
          value={appState.apiKey}
          onChange={(e) => setAppState(prevState => ({ ...prevState, apiKey: e.target.value }))}
          placeholder="Paste your API key here"
          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200"
        />
        <p className="text-xs text-gray-500 mt-2">
          Don't have a key?{" "}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
            Get one from Google AI Studio
          </a>
        </p>
      </div>
    
      <div>
          <h2 className="text-lg font-bold text-secondary">2. Upload Headshot</h2>
          <p className="text-sm text-gray-500 mb-3">Provide a clear portrait image (JPG/PNG).</p>
          <ImageUploader onFileSelect={(file) => onFileSelect(file, 'headshot')} title="Drag & Drop Headshot" />
      </div>

      <div>
          <h2 className="text-lg font-bold text-secondary">3. Video Topic</h2>
          <p className="text-sm text-gray-500 mb-3">Describe what your video is about.</p>
          <textarea
          value={appState.videoTopic}
          onChange={(e) => setAppState(prevState => ({ ...prevState, videoTopic: e.target.value }))}
          placeholder="e.g., How I built a startup with $100"
          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 resize-none"
          rows={3}
          />
      </div>
      
      <div>
          <h2 className="text-lg font-bold text-secondary">4. Style Inspiration (Optional)</h2>
          <p className="text-sm text-gray-500 mb-3">Upload a thumbnail you like for style reference.</p>
          <ImageUploader onFileSelect={(file) => onFileSelect(file, 'styleInspiration')} title="Drag & Drop Style Reference" />
      </div>

      <GenerateButton
          onClick={onGenerateClick}
          isLoading={appState.isLoading}
          disabled={!appState.apiKey || !appState.headshotFile || !appState.videoTopic}
      />

      {appState.error && <p className="text-red-500 text-sm mt-4 text-center">{appState.error}</p>}
    </div>
  );
};
