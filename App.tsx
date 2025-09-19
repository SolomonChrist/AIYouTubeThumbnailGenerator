import React, { useState, useCallback } from 'react';
import { ThumbnailGrid } from './components/ThumbnailGrid';
import { ControlsPanel } from './components/ControlsPanel';
import { generateThumbnails } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    apiKey: '',
    headshotFile: null,
    styleInspirationFile: null,
    videoTopic: '',
    generatedThumbnails: [],
    isLoading: false,
    error: null,
  });

  const handleFileSelect = useCallback((file: File, type: 'headshot' | 'styleInspiration') => {
    setAppState(prevState => ({
      ...prevState,
      [type === 'headshot' ? 'headshotFile' : 'styleInspirationFile']: file,
    }));
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!appState.apiKey || !appState.headshotFile || !appState.videoTopic) {
      setAppState(prevState => ({ ...prevState, error: 'API Key, Headshot, and Video Topic are required.' }));
      return;
    }

    setAppState(prevState => ({ ...prevState, isLoading: true, error: null, generatedThumbnails: [] }));

    try {
      const headshotBase64 = await fileToBase64(appState.headshotFile);
      const styleInspirationBase64 = appState.styleInspirationFile
        ? await fileToBase64(appState.styleInspirationFile)
        : null;

      const thumbnails = await generateThumbnails(
        appState.apiKey,
        headshotBase64,
        appState.videoTopic,
        styleInspirationBase64
      );
      
      setAppState(prevState => ({ ...prevState, generatedThumbnails: thumbnails, isLoading: false }));
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Check your API key and try again.';
      setAppState(prevState => ({ ...prevState, error: `Failed to generate thumbnails. ${errorMessage}`, isLoading: false }));
    }
  }, [appState.apiKey, appState.headshotFile, appState.styleInspirationFile, appState.videoTopic]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                 <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.52-1.937c.324-.101.642.124.75.454.11.33-.064.69-.4.81a2.001 2.001 0 01-1.872 1.666c-.352.09-.652.323-.844.622a3.004 3.004 0 00-1.88 2.399A1.5 1.5 0 017.5 14c-.666 0-1.15-.39-1.389-.893a6.002 6.002 0 01-1.9-2.92 6.012 6.012 0 01-.179-1.16z" clipRule="evenodd"></path></svg>
                 <h1 className="text-xl md:text-2xl font-bold text-secondary">Solomon Christs' AI YouTube Thumbnail Generator</h1>
            </div>
            <a href="https://github.com/google/generative-ai-docs" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg>
            </a>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <ControlsPanel 
            appState={appState}
            setAppState={setAppState}
            onFileSelect={handleFileSelect}
            onGenerateClick={handleGenerateClick}
          />

          {/* Output Column */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-[600px]">
            <ThumbnailGrid images={appState.generatedThumbnails} isLoading={appState.isLoading} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-5 text-sm text-gray-600">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <p className="font-semibold mb-1">Free AI & Automation Training:</p>
                    <div className="flex flex-col md:flex-row gap-x-4">
                      <a href="https://youtu.be/vihx2ZPvw0M?si=lOT4b8E8BKL0_CBT" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Foundations LEVEL 1</a>
                      <a href="https://youtu.be/rkIU6R6hPwE?si=G-kA3HktcJwaUGz8" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Foundations LEVEL 2 (n8n)</a>
                    </div>
                </div>
                <div className="text-center md:text-right flex flex-col sm:flex-row sm:items-center gap-x-4">
                    <a href="https://www.skool.com/learn-automation/about" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                        Join the Skool Community
                    </a>
                    <a href="https://www.solomonchrist.com" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                        solomonchrist.com
                    </a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;