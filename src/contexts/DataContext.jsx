import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [videos, setVideos] = useState([])
  const [stories, setStories] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [trending, setTrending] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Charger les données depuis localStorage
    loadData()
  }, [currentUser])

  const loadData = () => {
    if (!currentUser) return

    // Charger les posts
    const savedPosts = JSON.parse(localStorage.getItem('nester_posts') || '[]')
    setPosts(savedPosts)

    // Charger les vidéos
    const savedVideos = JSON.parse(localStorage.getItem('nester_videos') || '[]')
    setVideos(savedVideos)

    // Charger les stories
    const savedStories = JSON.parse(localStorage.getItem('nester_stories') || '[]')
    setStories(savedStories)

    // Charger les messages
    const savedMessages = JSON.parse(localStorage.getItem('nester_messages') || '[]')
    setMessages(savedMessages)

    // Charger les notifications
    const savedNotifications = JSON.parse(localStorage.getItem('nester_notifications') || '[]')
    setNotifications(savedNotifications)

    // Charger les utilisateurs
    const savedUsers = JSON.parse(localStorage.getItem('nester_users') || '[]')
    setUsers(savedUsers)

    // Calculer les tendances
    calculateTrending()
  }

  const calculateTrending = () => {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const trendingVideos = videos.filter(video => {
      const videoDate = new Date(video.createdAt)
      return videoDate > oneDayAgo && video.likes >= 2000
    })
    
    setTrending(trendingVideos)
  }

  const addPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      content: postData.content,
      media: postData.media || [],
      location: postData.location || '',
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date().toISOString(),
      type: 'post'
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem('nester_posts', JSON.stringify(updatedPosts))

    // Ajouter aux posts de l'utilisateur
    const updatedUser = {
      ...currentUser,
      posts: [newPost.id, ...currentUser.posts]
    }
    localStorage.setItem('nester_user', JSON.stringify(updatedUser))
  }

  const addVideo = (videoData) => {
    const newVideo = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      title: videoData.title,
      description: videoData.description,
      url: videoData.url,
      thumbnail: videoData.thumbnail,
      duration: videoData.duration || 0,
      likes: [],
      comments: [],
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      type: 'video'
    }

    const updatedVideos = [newVideo, ...videos]
    setVideos(updatedVideos)
    localStorage.setItem('nester_videos', JSON.stringify(updatedVideos))

    // Ajouter aux vidéos de l'utilisateur
    const updatedUser = {
      ...currentUser,
      videos: [newVideo.id, ...currentUser.videos]
    }
    localStorage.setItem('nester_user', JSON.stringify(updatedUser))
  }

  const addStory = (storyData) => {
    const newStory = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      media: storyData.media,
      type: storyData.type, // 'image' ou 'video'
      duration: storyData.duration || 5000,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      views: [],
      reactions: []
    }

    const updatedStories = [newStory, ...stories]
    setStories(updatedStories)
    localStorage.setItem('nester_stories', JSON.stringify(updatedStories))
  }

  const likePost = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUser.id)
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id]
        }
      }
      return post
    })
    setPosts(updatedPosts)
    localStorage.setItem('nester_posts', JSON.stringify(updatedPosts))
  }

  const commentPost = (postId, comment) => {
    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userProfilePicture: currentUser.profilePicture,
      content: comment.content,
      emoji: comment.emoji || null,
      isCreator: false,
      likes: [],
      replies: [],
      createdAt: new Date().toISOString()
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        }
      }
      return post
    })
    setPosts(updatedPosts)
    localStorage.setItem('nester_posts', JSON.stringify(updatedPosts))
  }

  const followUser = (targetUserId) => {
    if (!currentUser) return

    const updatedUser = {
      ...currentUser,
      following: currentUser.following.includes(targetUserId)
        ? currentUser.following.filter(id => id !== targetUserId)
        : [...currentUser.following, targetUserId]
    }

    // Mettre à jour l'utilisateur cible
    const updatedUsers = users.map(user => {
      if (user.id === targetUserId) {
        return {
          ...user,
          followers: updatedUser.following.includes(targetUserId)
            ? [...user.followers, currentUser.id]
            : user.followers.filter(id => id !== currentUser.id)
        }
      }
      return user
    })

    setUsers(updatedUsers)
    localStorage.setItem('nester_users', JSON.stringify(updatedUsers))
    localStorage.setItem('nester_user', JSON.stringify(updatedUser))
  }

  const sendMessage = (receiverId, messageData) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId,
      content: messageData.content,
      media: messageData.media || null,
      type: messageData.type || 'text',
      createdAt: new Date().toISOString(),
      isRead: false
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    localStorage.setItem('nester_messages', JSON.stringify(updatedMessages))
  }

  const addNotification = (notificationData) => {
    const newNotification = {
      id: Date.now().toString(),
      userId: currentUser.id,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || {},
      isRead: false,
      createdAt: new Date().toISOString()
    }

    const updatedNotifications = [newNotification, ...notifications]
    setNotifications(updatedNotifications)
    localStorage.setItem('nester_notifications', JSON.stringify(updatedNotifications))
  }

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId)
    setPosts(updatedPosts)
    localStorage.setItem('nester_posts', JSON.stringify(updatedPosts))
  }

  const deleteVideo = (videoId) => {
    const updatedVideos = videos.filter(video => video.id !== videoId)
    setVideos(updatedVideos)
    localStorage.setItem('nester_videos', JSON.stringify(updatedVideos))
  }

  const searchContent = (query) => {
    const searchResults = {
      users: users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.bio?.toLowerCase().includes(query.toLowerCase())
      ),
      posts: posts.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase())
      ),
      videos: videos.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description?.toLowerCase().includes(query.toLowerCase())
      )
    }
    return searchResults
  }

  const value = {
    posts,
    videos,
    stories,
    messages,
    notifications,
    trending,
    users,
    addPost,
    addVideo,
    addStory,
    likePost,
    commentPost,
    followUser,
    sendMessage,
    addNotification,
    deletePost,
    deleteVideo,
    searchContent,
    calculateTrending
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}