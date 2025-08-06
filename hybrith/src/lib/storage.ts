import { User, Video, Comment, Message, Story, Challenge, Ranking } from '@/types';

// Clés de stockage
const STORAGE_KEYS = {
  USERS: 'hybrith_users',
  VIDEOS: 'hybrith_videos',
  MESSAGES: 'hybrith_messages',
  STORIES: 'hybrith_stories',
  CHALLENGES: 'hybrith_challenges',
  RANKINGS: 'hybrith_rankings',
  CURRENT_USER: 'hybrith_current_user',
  THEME: 'hybrith_theme',
};

// Service de stockage générique
class StorageService {
  private getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  private removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  // Gestion des utilisateurs
  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS) || [];
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.saveUsers(users);
  }

  // Gestion des vidéos
  getVideos(): Video[] {
    return this.getItem<Video[]>(STORAGE_KEYS.VIDEOS) || [];
  }

  saveVideos(videos: Video[]): void {
    this.setItem(STORAGE_KEYS.VIDEOS, videos);
  }

  getVideoById(id: string): Video | null {
    const videos = this.getVideos();
    return videos.find(video => video.id === id) || null;
  }

  saveVideo(video: Video): void {
    const videos = this.getVideos();
    const index = videos.findIndex(v => v.id === video.id);
    if (index >= 0) {
      videos[index] = video;
    } else {
      videos.push(video);
    }
    this.saveVideos(videos);
  }

  // Gestion des messages
  getMessages(): Message[] {
    return this.getItem<Message[]>(STORAGE_KEYS.MESSAGES) || [];
  }

  saveMessages(messages: Message[]): void {
    this.setItem(STORAGE_KEYS.MESSAGES, messages);
  }

  saveMessage(message: Message): void {
    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);
  }

  // Gestion des stories
  getStories(): Story[] {
    return this.getItem<Story[]>(STORAGE_KEYS.STORIES) || [];
  }

  saveStories(stories: Story[]): void {
    this.setItem(STORAGE_KEYS.STORIES, stories);
  }

  saveStory(story: Story): void {
    const stories = this.getStories();
    stories.push(story);
    this.saveStories(stories);
  }

  // Gestion des challenges
  getChallenges(): Challenge[] {
    return this.getItem<Challenge[]>(STORAGE_KEYS.CHALLENGES) || [];
  }

  saveChallenges(challenges: Challenge[]): void {
    this.setItem(STORAGE_KEYS.CHALLENGES, challenges);
  }

  // Gestion des classements
  getRankings(): Ranking[] {
    return this.getItem<Ranking[]>(STORAGE_KEYS.RANKINGS) || [];
  }

  saveRankings(rankings: Ranking[]): void {
    this.setItem(STORAGE_KEYS.RANKINGS, rankings);
  }

  // Gestion de l'utilisateur courant
  getCurrentUser(): User | null {
    return this.getItem<User>(STORAGE_KEYS.CURRENT_USER);
  }

  setCurrentUser(user: User | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Gestion du thème
  getTheme(): 'light' | 'dark' {
    return this.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME) || 'dark';
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  // Utilitaires
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => this.removeItem(key));
  }

  // Génération d'ID unique
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };