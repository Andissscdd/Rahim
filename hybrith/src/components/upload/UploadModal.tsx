'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { X, Upload, Video, Image, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { addVideo } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast.error('Veuillez sélectionner un fichier vidéo');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Veuillez sélectionner une vidéo');
      return;
    }

    if (!title.trim()) {
      toast.error('Veuillez ajouter un titre');
      return;
    }

    setIsUploading(true);

    try {
      // Simuler l'upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer la nouvelle vidéo
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      addVideo({
        userId: '1', // ID de l'utilisateur courant
        username: 'alex_creative', // Nom d'utilisateur courant
        title: title.trim(),
        description: description.trim(),
        tags: tagArray,
        videoUrl: previewUrl || '/api/placeholder/400/600',
        thumbnailUrl: previewUrl || '/api/placeholder/400/600',
        likes: [],
        comments: [],
        shares: 0,
        views: 0,
        duration: 30, // Durée simulée
      });

      toast.success('Vidéo uploadée avec succès !');
      onClose();
      
      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-hybrith-dark-light rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-hybrith-primary to-hybrith-secondary bg-clip-text text-transparent">
                Créer une nouvelle vidéo
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Zone de drop */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-hybrith-primary transition-colors"
              >
                {!selectedFile ? (
                  <div className="space-y-4">
                    <Upload className="mx-auto text-gray-400" size={48} />
                    <div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Glissez votre vidéo ici
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        ou cliquez pour sélectionner un fichier
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-hybrith-primary text-white px-6 py-2 rounded-lg hover:bg-hybrith-neon-purple transition-colors"
                    >
                      Choisir un fichier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Video className="mx-auto text-hybrith-primary" size={48} />
                    <div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {selectedFile.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />
              </div>

              {/* Prévisualisation */}
              {previewUrl && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aperçu
                  </label>
                  <video
                    src={previewUrl}
                    className="w-full h-48 object-cover rounded-lg"
                    controls
                  />
                </div>
              )}

              {/* Titre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Titre
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent transition-all"
                    placeholder="Donnez un titre à votre vidéo"
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent transition-all resize-none"
                  placeholder="Décrivez votre vidéo..."
                  maxLength={500}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent transition-all"
                    placeholder="fun, créativité, tutorial (séparés par des virgules)"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-hybrith-dark transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="flex-1 bg-gradient-to-r from-hybrith-primary to-hybrith-secondary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-hybrith-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Upload en cours...' : 'Publier la vidéo'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}