# 🚀 HYBRITH - Plateforme Sociale Ultra-Addictive

HYBRITH est une plateforme sociale révolutionnaire qui combine le meilleur de TikTok et Facebook. Créez, partagez et découvrez du contenu viral avec une expérience utilisateur immersive et moderne.

## ✨ Fonctionnalités Principales

### 🎬 **Fil d'actualité TikTok-like**
- Scroll vertical fluide par vidéo
- Lecture automatique et contrôles vidéo
- Système de likes, commentaires et partages
- Navigation intuitive avec touches clavier

### 👤 **Profils Utilisateurs Complets**
- Photos de profil personnalisables
- Statistiques détaillées (vues, likes, rang)
- Badges de gamification
- Bio et informations personnelles
- Affichage des vidéos publiées

### 🤝 **Système d'Amis**
- Ajouter/supprimer des amis
- Recherche d'utilisateurs
- Profils d'amis accessibles
- Système de suivi

### 📱 **Messagerie Privée**
- Conversations en temps réel
- Interface chat moderne
- Recherche de conversations
- Indicateurs de lecture

### 🎥 **Création de Contenu**
- Upload de vidéos depuis l'appareil
- Édition de métadonnées (titre, description, tags)
- Prévisualisation avant publication
- Conseils pour le contenu viral

### 🔍 **Recherche Avancée**
- Recherche globale (utilisateurs, vidéos, tags)
- Résultats en temps réel
- Suggestions de tendances
- Filtres intelligents

### 🌗 **Mode Sombre/Clair**
- Design moderne adaptatif
- Transitions fluides
- Préférences sauvegardées

### 🏆 **Gamification**
- Badges de progression
- Classements par popularité
- Statistiques détaillées
- Système de points

## 🛠️ Technologies Utilisées

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Stockage**: localStorage (simulation)
- **État**: Context API + useReducer

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd hybrith

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Accès
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎯 Utilisation

### 🔐 **Connexion**
1. Utilisez le bouton "Connexion démo" pour tester rapidement
2. Ou créez un compte avec email/mot de passe
3. Les données sont simulées localement

### 📱 **Navigation**
- **Accueil** : Fil d'actualité principal
- **Recherche** : Trouver du contenu et des utilisateurs
- **Créer** : Publier de nouvelles vidéos
- **Messages** : Messagerie privée
- **Profil** : Gérer votre compte

### 🎮 **Contrôles Vidéo**
- **Scroll** : Navigation entre vidéos
- **Espace** : Play/Pause
- **M** : Mute/Unmute
- **Flèches** : Navigation clavier

## 🎨 Design System

### Couleurs
- **Primaire** : Violet électrique (#8B5CF6)
- **Secondaire** : Vert néon (#10B981)
- **Fond** : Noir (#0F0F0F)
- **Texte** : Blanc/Gris clair

### Typographie
- **Police** : Inter (Google Fonts)
- **Responsive** : Mobile-first design
- **Animations** : Framer Motion

## 📱 Responsive Design

HYBRITH est entièrement responsive et optimisé pour :
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔧 Structure du Projet

```
hybrith/
├── src/
│   ├── app/                 # Pages Next.js
│   │   ├── page.tsx        # Page d'accueil
│   │   ├── login/          # Authentification
│   │   ├── register/       # Inscription
│   │   ├── feed/           # Fil d'actualité
│   │   ├── profile/        # Profil utilisateur
│   │   ├── create/         # Création de vidéo
│   │   └── messages/       # Messagerie
│   ├── components/         # Composants réutilisables
│   ├── context/           # État global
│   ├── types/             # Types TypeScript
│   ├── utils/             # Utilitaires
│   └── styles/            # Styles globaux
├── public/                # Assets statiques
└── package.json
```

## 🎯 Fonctionnalités Futures

- [ ] **Stories** : Format 24h avec images/vidéos
- [ ] **IA Avancée** : Recommandations intelligentes
- [ ] **Challenges** : Défis hebdomadaires
- [ ] **Live Streaming** : Diffusion en direct
- [ ] **Backend** : API REST + Base de données
- [ ] **Notifications** : Push notifications
- [ ] **Analytics** : Statistiques détaillées
- [ ] **Modération** : Système de signalement

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Next.js** pour le framework React
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide** pour les icônes
- **React Hot Toast** pour les notifications

---

**HYBRITH** - La plateforme sociale du futur 🚀

*Créé avec ❤️ et beaucoup de café ☕*
