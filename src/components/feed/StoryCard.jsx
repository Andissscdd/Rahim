import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Camera } from 'lucide-react'

const StoryCard = ({ story, isAdd = false, onClick }) => {
  if (isAdd) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <Plus className="w-6 h-6 text-gray-400" />
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-red-500 p-1 cursor-pointer"
    >
      <div className="w-full h-full rounded-full overflow-hidden">
        <img
          src={story.userProfilePicture || '/default-avatar.png'}
          alt="Story"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  )
}

export default StoryCard