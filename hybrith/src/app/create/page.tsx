'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { 
  Upload, 
  Video, 
  Camera, 
  X, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Hash,
  Send,
  ArrowLeft
} from 'lucide-react';
import { generateId } from '@/utils/storage';
import toast from 'react-hot-toast';

export default function CreatePage() {
  const { state, addVideo } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        toast.success('Vidéo sélectionnée !');
      } else {
        toast.error('Veuillez sélectionner un fichier vidéo');
      }
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
      // Simuler un upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newVideo = {
        id: generateId(),
        userId: state.currentUser?.id || '',
        username: state.currentUser?.username || '',
        userAvatar: state.currentUser?.avatar,
        title: title.trim(),
        description: description.trim(),
        tags: tags,
        videoUrl: videoUrl, // En production, ce serait l'URL uploadée
        thumbnailUrl: '/api/placeholder/400/600', // En production, généré automatiquement
        likes: [],
        comments: [],
        views: 0,
        createdAt: new Date(),
        duration: 30, // En production, calculé automatiquement
        isPublic: true
      };

      addVideo(newVideo);
      toast.success('Vidéo publiée avec succès !');
      
      // Reset form
      setSelectedFile(null);
      setVideoUrl('');
      setTitle('');
      setDescription('');
      setTags([]);
    } catch (error) {
      toast.error('Erreur lors de la publication');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-20">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Créer une vidéo</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zone d'upload */}
          <div className="space-y-4">
            {!videoUrl ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors"
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sélectionner une vidéo</h3>
                  <p className="text-gray-400 mb-4">
                    Glissez-déposez votre vidéo ou cliquez pour parcourir
                  </p>
                  <div className="bg-purple-600 hover:bg-purple-700 inline-flex items-center px-6 py-3 rounded-full transition-colors">
                    <Camera className="w-5 h-5 mr-2" />
                    Choisir une vidéo
                  </div>
                </label>
              </motion.div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full rounded-2xl"
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Contrôles vidéo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVideoPlayPause}
                    className="p-4 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Contrôles audio */}
                <div className="absolute top-4 right-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Bouton supprimer */}
                <div className="absolute top-4 left-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedFile(null);
                      setVideoUrl('');
                    }}
                    className="p-2 bg-red-500/80 backdrop-blur-sm rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Informations de la vidéo */}
          <div className="space-y-4">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Donnez un titre accrocheur à votre vidéo..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1">{title.length}/100</div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre vidéo..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">{description.length}/500</div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                >
                  <Hash className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bouton de publication */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isUploading || !selectedFile || !title.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Publication en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Publier la vidéo
              </>
            )}
          </motion.button>
        </form>

        {/* Conseils */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <h3 className="font-semibold text-purple-400 mb-2">💡 Conseils pour un contenu viral</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Utilisez des titres accrocheurs et des hashtags populaires</li>
            <li>• Créez du contenu authentique et engageant</li>
            <li>• Postez régulièrement pour maintenir l'engagement</li>
            <li>• Interagissez avec votre communauté</li>
          </ul>
        </div>
      </div>
    </div>
  );
}