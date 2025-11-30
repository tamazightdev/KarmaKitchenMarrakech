import React, { useState } from 'react';
import { BlogPost } from '../types';
import { CopyIcon, CheckIcon, SaveIcon, DriveIcon } from './Icons';

interface BlogPostCardProps {
  post: BlogPost;
  onSaveLocal: (post: BlogPost) => void;
  onSaveDrive: (post: BlogPost) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onSaveLocal, onSaveDrive }) => {
  const [copied, setCopied] = useState(false);
  const [savedLocal, setSavedLocal] = useState(false);
  const [savedDrive, setSavedDrive] = useState(false);

  const handleCopy = () => {
    // Ensure paragraphs are separated by double newlines for plain text editors
    // We replace single newlines with double newlines
    const formattedContent = post.content.split('\n').join('\n\n');
    const textToCopy = `${post.title}\n\n${formattedContent}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLocalSave = () => {
    onSaveLocal(post);
    setSavedLocal(true);
    setTimeout(() => setSavedLocal(false), 2000);
  };

  const handleDriveSave = () => {
    onSaveDrive(post);
    setSavedDrive(true);
    setTimeout(() => setSavedDrive(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] flex flex-col h-full relative group">
      
      {/* Header Actions (Copy) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white text-gray-700 transition-all"
          title="Copy to clipboard"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold mb-4 font-serif text-gray-900 leading-tight pr-8">
        {post.title}
      </h3>
      
      <div className="prose prose-gray max-w-none flex-grow">
        {post.content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-3 text-gray-700 leading-relaxed font-sans text-[1.05rem]">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200/30 flex justify-between items-center">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 opacity-60"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 opacity-30"></span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleLocalSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${savedLocal ? 'bg-green-100 text-green-700' : 'bg-white/50 hover:bg-white text-gray-600'}`}
            title="Save to Local Database"
          >
            {savedLocal ? <CheckIcon className="w-4 h-4" /> : <SaveIcon className="w-4 h-4" />}
            {savedLocal ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={handleDriveSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${savedDrive ? 'bg-blue-100 text-blue-700' : 'bg-white/50 hover:bg-white text-gray-600'}`}
            title="Save to Google Drive"
          >
            {savedDrive ? <CheckIcon className="w-4 h-4" /> : <DriveIcon className="w-4 h-4" />}
            {savedDrive ? 'Sent' : 'Drive'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;