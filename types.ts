export interface AppState {
  apiKey: string;
  headshotFile: File | null;
  styleInspirationFile: File | null;
  videoTopic: string;
  generatedThumbnails: string[];
  isLoading: boolean;
  error: string | null;
}

export interface ControlsPanelProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onFileSelect: (file: File, type: 'headshot' | 'styleInspiration') => void;
  onGenerateClick: () => void;
}
