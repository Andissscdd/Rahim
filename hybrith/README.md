# 🚀 HYBRITH - La plateforme sociale du futur

HYBRITH est une plateforme sociale ultra-addictive qui combine les meilleures fonctionnalités de TikTok et Facebook. Créée avec React, Next.js, Tailwind CSS et Framer Motion, elle offre une expérience utilisateur moderne et immersive.

## ✨ Fonctionnalités principales

### 🎬 Feed de vidéos (style TikTok)
- **Swipe vertical** fluide entre les vidéos
- **Lecture automatique** avec contrôles de lecture
- **Interactions** : Like, commentaires, partage, signalement
- **Navigation** par touches clavier (flèches haut/bas)
- **Barre de progression** en temps réel

### 👥 Système d'amis et profils
- **Profils complets** avec bio, statistiques, badges
- **Système de followers** avec compteurs
- **Recherche d'utilisateurs** en temps réel
- **Badges de gamification** (🔥 Viral, 🎯 Ciblé, 🎭 Anonyme)

### 📱 Stories
- **Format rond** comme Instagram/Facebook
- **Expiration automatique** après 24h
- **Support image et vidéo** (15 secondes max)
- **Animations fluides** avec gradients

### 🔍 Recherche avancée
- **Recherche globale** : utilisateurs, vidéos, tags
- **Résultats en temps réel** avec filtres
- **Interface intuitive** avec catégories

### 💬 Messagerie privée
- **Chat en temps réel** entre amis
- **Interface moderne** avec avatars
- **Notifications** de nouveaux messages

### 🏆 Classements et challenges
- **Top 10** par popularité (likes, vues)
- **Challenges hebdomadaires** avec récompenses
- **Badges exclusifs** pour les gagnants
- **Statistiques détaillées**

### 🎨 Design moderne
- **Dark mode** par défaut avec toggle
- **Couleurs HYBRITH** : violet électrique, vert néon
- **Animations fluides** avec Framer Motion
- **Responsive design** mobile-first
- **Gradients animés** et effets visuels

### 📤 Upload de vidéos
- **Drag & drop** pour les fichiers
- **Prévisualisation** avant publication
- **Tags et descriptions** enrichies
- **Upload progressif** avec feedback

## 🛠️ Technologies utilisées

- **Frontend** : React 18, Next.js 14, TypeScript
- **Styling** : Tailwind CSS avec animations personnalisées
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Notifications** : React Hot Toast
- **État global** : Context API + useReducer
- **Stockage** : localStorage (simulation de base de données)
- **Backend** : Firebase (configuration prête)

## 🚀 Installation et démarrage

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

# Démarrer le serveur de développement
npm run dev
```

### Accès à l'application
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 👤 Comptes de démonstration

Pour tester l'application, utilisez ces comptes :

| Utilisateur | Mot de passe | Description |
|-------------|--------------|-------------|
| `alex_creative` | `demo123` | Créateur de contenu digital |
| `sarah_dance` | `demo123` | Danseuse professionnelle |
| `mike_tech` | `demo123` | Tech enthusiast |
| `lisa_food` | `demo123` | Food lover |

## 🎯 Fonctionnalités détaillées

### Page d'accueil animée
- **Animation futuriste** avec particules flottantes
- **Logo HYBRITH** avec gradient animé
- **Boutons d'action** avec effets hover
- **Statistiques animées** de la plateforme

### Système d'authentification
- **Inscription** avec validation en temps réel
- **Connexion** avec comptes de démo
- **Validation des formulaires** complète
- **Messages d'erreur** contextuels

### Algorithme de recommandations
- **Tri par popularité** (likes, vues)
- **Mélange avec vidéos d'amis**
- **Basé sur le temps de visionnage**
- **Personnalisation progressive**

### Gamification
- **Badges automatiques** selon l'activité
- **Challenges hebdomadaires** avec récompenses
- **Classements** par catégorie
- **Système de points** et niveaux

## 🎨 Palette de couleurs HYBRITH

```css
/* Couleurs principales */
--hybrith-primary: #8B5CF6;    /* Violet électrique */
--hybrith-secondary: #10B981;  /* Vert néon */
--hybrith-accent: #F59E0B;     /* Orange doré */
--hybrith-dark: #111827;       /* Noir profond */
--hybrith-dark-light: #1F2937; /* Noir plus clair */
--hybrith-neon-purple: #A855F7; /* Violet néon */
--hybrith-neon-green: #22C55E;  /* Vert néon vif */
```

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Mobile-first** approach
- **Breakpoints** optimisés
- **Navigation adaptative** selon l'écran
- **Gestures tactiles** pour le swipe

## 🔧 Configuration Firebase (optionnel)

Pour activer Firebase, modifiez `src/lib/firebase.ts` :

```typescript
const firebaseConfig = {
  apiKey: "votre-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Déployer le dossier .next
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Framer Motion** pour les animations fluides
- **Tailwind CSS** pour le styling moderne
- **Lucide React** pour les icônes
- **Next.js** pour le framework React

---

**HYBRITH** - Découvrez, créez et partagez des moments uniques. Rejoignez la communauté qui révolutionne le partage de contenu ! 🚀
