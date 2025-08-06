export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  friends: string[];
  videos: string[];
  likes: number;
  views: number;
  badges: string[];
  isOnline: boolean;
  lastSeen: string;
  location?: string;
  verified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Clé pour localStorage
const AUTH_STORAGE_KEY = 'hybrith_auth';
const USERS_STORAGE_KEY = 'hybrith_users';

// Utilisateurs par défaut pour la démo
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'alexandra_cyber',
    email: 'alex@hybrith.com',
    avatar: '',
    bio: '🎬 Créatrice de contenu viral | 🌟 Passionnée de tech',
    joinedAt: '2024-01-15',
    friends: ['2', '3'],
    videos: ['video1', 'video2'],
    likes: 15420,
    views: 234567,
    badges: ['🔥 Viral', '🎭 Créative', '🏆 Top Creator'],
    isOnline: true,
    lastSeen: new Date().toISOString(),
    location: 'Paris, France',
    verified: true,
  },
  {
    id: '2',
    username: 'techguru_max',
    email: 'max@hybrith.com',
    avatar: '',
    bio: '💻 Développeur full-stack | 🚀 Innovateur',
    joinedAt: '2024-02-01',
    friends: ['1', '3'],
    videos: ['video3', 'video4'],
    likes: 8930,
    views: 156789,
    badges: ['🧠 Tech Expert', '🎯 Ciblé'],
    isOnline: false,
    lastSeen: '2024-12-01T10:30:00Z',
    location: 'Lyon, France',
    verified: true,
  },
  {
    id: '3',
    username: 'sarah_vibes',
    email: 'sarah@hybrith.com',
    avatar: '',
    bio: '✨ Lifestyle & Motivation | 🌈 Positive vibes only',
    joinedAt: '2024-01-20',
    friends: ['1', '2'],
    videos: ['video5', 'video6'],
    likes: 12340,
    views: 198765,
    badges: ['💫 Inspirante', '🎨 Créative'],
    isOnline: true,
    lastSeen: new Date().toISOString(),
    location: 'Marseille, France',
    verified: false,
  },
];

// Initialiser les utilisateurs par défaut
export const initializeDefaultUsers = (): void => {
  if (typeof window !== 'undefined') {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = (): User[] => {
  if (typeof window !== 'undefined') {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }
  return [];
};

// Sauvegarder tous les utilisateurs
export const saveAllUsers = (users: User[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

// Récupérer l'état d'authentification
export const getAuthState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return {
        user: parsed.user,
        isAuthenticated: !!parsed.user,
      };
    }
  }
  return {
    user: null,
    isAuthenticated: false,
  };
};

// Sauvegarder l'état d'authentification
export const saveAuthState = (user: User | null): void => {
  if (typeof window !== 'undefined') {
    const authState = {
      user,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }
};

// Inscription
export const register = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const users = getAllUsers();
    const existingUser = users.find(
      (u) => u.email === userData.email || u.username === userData.username
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Un utilisateur avec cet email ou ce pseudo existe déjà',
      };
    }

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      bio: '',
      joinedAt: new Date().toISOString(),
      friends: [],
      videos: [],
      likes: 0,
      views: 0,
      badges: ['🌟 Nouveau'],
      isOnline: true,
      lastSeen: new Date().toISOString(),
      verified: false,
    };

    // Ajouter aux utilisateurs
    users.push(newUser);
    saveAllUsers(users);

    // Connecter automatiquement
    saveAuthState(newUser);

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de l\'inscription',
    };
  }
};

// Connexion
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const users = getAllUsers();
    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      return {
        success: false,
        error: 'Email ou mot de passe incorrect',
      };
    }

    // Mettre à jour le statut en ligne
    user.isOnline = true;
    user.lastSeen = new Date().toISOString();
    
    // Sauvegarder les modifications
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
    saveAllUsers(updatedUsers);

    // Connecter l'utilisateur
    saveAuthState(user);

    return {
      success: true,
      user,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors de la connexion',
    };
  }
};

// Déconnexion
export const logout = (): void => {
  const authState = getAuthState();
  if (authState.user) {
    // Mettre à jour le statut hors ligne
    const users = getAllUsers();
    const updatedUsers = users.map((u) =>
      u.id === authState.user!.id
        ? { ...u, isOnline: false, lastSeen: new Date().toISOString() }
        : u
    );
    saveAllUsers(updatedUsers);
  }

  // Supprimer l'authentification
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = (updates: Partial<User>): User | null => {
  const authState = getAuthState();
  if (!authState.user) return null;

  const users = getAllUsers();
  const updatedUser = { ...authState.user, ...updates };
  
  const updatedUsers = users.map((u) =>
    u.id === authState.user!.id ? updatedUser : u
  );
  
  saveAllUsers(updatedUsers);
  saveAuthState(updatedUser);
  
  return updatedUser;
};

// Récupérer un utilisateur par ID
export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
};

// Rechercher des utilisateurs
export const searchUsers = (query: string): User[] => {
  const users = getAllUsers();
  const lowerQuery = query.toLowerCase();
  
  return users.filter(
    (user) =>
      user.username.toLowerCase().includes(lowerQuery) ||
      user.bio?.toLowerCase().includes(lowerQuery)
  );
};