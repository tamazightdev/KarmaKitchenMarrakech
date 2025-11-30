import React from 'react';
import { SavedPost } from '../types';
import { TrashIcon, CopyIcon } from './Icons';

interface SavedPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SavedPost[];
  onDelete: (id: string) => void;
}

const SavedPostsModal: React.FC<SavedPostsModalProps> = ({ isOpen, onClose, posts, onDelete }) => {
  if (!isOpen) return null;

  const handleCopy = (post: SavedPost) => {
    const text = `${post.title}\n\n${post.content}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-gray-200/30 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Saved Riffs</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No saved posts yet.</p>
              <p className="text-sm mt-2">Generate and save some riffs to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white/40 rounded-xl p-4 border border-white/50 hover:bg-white/60 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 font-serif">{post.title}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCopy(post)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Copy"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(post.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-3 font-sans">
                    {post.content}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Saved on {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-black text-white font-medium shadow-lg hover:bg-gray-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedPostsModal;
