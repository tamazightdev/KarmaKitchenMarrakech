import React, { useState, useEffect } from 'react';
import { GeminiModel } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  googleClientId: string;
  model: GeminiModel;
  onSave: (key: string, clientId: string, model: GeminiModel) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, googleClientId, model, onSave }) => {
  const [localKey, setLocalKey] = useState(apiKey);
  const [localClientId, setLocalClientId] = useState(googleClientId);
  const [localModel, setLocalModel] = useState<GeminiModel>(model);

  useEffect(() => {
    setLocalKey(apiKey);
    setLocalClientId(googleClientId || '');
    setLocalModel(model);
  }, [apiKey, googleClientId, model, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localKey, localClientId, localModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 font-serif">Settings</h2>
        
        <div className="space-y-6">
          {/* Gemini API Key */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Gemini API Key <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="Enter your AI Studio API Key"
              className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for generating content. Stored locally in your browser.
            </p>
          </div>

          {/* Google Client ID */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Google Client ID <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input
              type="text"
              value={localClientId}
              onChange={(e) => setLocalClientId(e.target.value)}
              placeholder="For Save to Google Drive"
              className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required only if you want to use the "Save to Google Drive" feature.
              Create an OAuth 2.0 Client ID in Google Cloud Console.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">Model</label>
            <div className="relative">
              <select
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value as GeminiModel)}
                className="w-full px-4 py-3 rounded-xl glass-input appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-800"
              >
                <option value={GeminiModel.PRO}>Gemini 3 Pro (High Intelligence)</option>
                <option value={GeminiModel.FLASH}>Gemini 2.5 Flash (Fast)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-100/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-black text-white font-medium shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;