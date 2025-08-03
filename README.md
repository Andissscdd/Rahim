# Nester - Plateforme Sociale Révolutionnaire

Nester est une plateforme sociale révolutionnaire qui combine les meilleures fonctionnalités de Facebook, TikTok, Instagram, Snapchat, X et YouTube dans une expérience unifiée et moderne.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Inscription complète avec photo de profil et couverture
- Connexion sécurisée
- Profils détaillés avec bio, localisation, métier, etc.
- Comptes privés/publics

### 📱 Interface Moderne
- Design sombre avec accents bleus
- Interface responsive (mobile, tablette, desktop)
- Animations fluides avec Framer Motion
- Navigation intuitive

### 📝 Posts & Contenu
- Création de posts avec texte, images, vidéos
- Support des emojis et GIFs
- Géolocalisation
- Système de likes, commentaires et partages
- Partage sur les réseaux sociaux externes

### 🎥 Vidéos
- Upload de vidéos via fichier ou URL
- Lecteur vidéo intégré style TikTok
- Navigation par flèches (PC) ou swipe (mobile)
- Support YouTube, TikTok et autres plateformes

### 💬 Messagerie
- Chat privé en temps réel
- Envoi de messages texte, images, GIFs
- Appels vocaux et vidéo
- Notifications de nouveaux messages

### 📢 Stories & Live
- Création de stories (24h)
- Streaming en direct avec chat
- Réactions en temps réel
- Contrôles de caméra/micro

### 🔍 Recherche
- Recherche globale (utilisateurs, posts, vidéos)
- Filtres par type de contenu
- Résultats en temps réel

### 👥 Profils & Social
- Pages de profil complètes
- Système d'abonnements/abonnés
- Statistiques détaillées
- Modification de profil

### ⚙️ Paramètres
- Configuration complète du compte
- Paramètres de confidentialité
- Notifications personnalisables
- Thèmes et langues

### 🔔 Notifications
- Système de notifications en temps réel
- Filtres par type
- Actions contextuelles

### ❤️ Favoris
- Sauvegarde de contenu aimé
- Organisation par type
- Mode grille/liste

## 🛠️ Technologies

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icônes**: Lucide React
- **Routage**: React Router DOM
- **Internationalisation**: i18next
- **Stockage**: localStorage (développement)
- **Lecteur vidéo**: React Player
- **Emojis**: Emoji Picker React

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/nester.git
cd nester
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du Projet

```
src/
├── components/
│   ├── auth/           # Authentification
│   ├── feed/           # Fil d'actualité
│   ├── videos/         # Gestion des vidéos
│   ├── messages/       # Messagerie
│   ├── notifications/  # Notifications
│   ├── favorites/      # Favoris
│   ├── profile/        # Profils utilisateurs
│   ├── settings/       # Paramètres
│   ├── live/           # Streaming en direct
│   ├── search/         # Recherche
│   └── layout/         # Composants de layout
├── contexts/           # Contextes React
├── utils/              # Utilitaires
└── styles/             # Styles globaux
```

## 🎯 Fonctionnalités Clés

### Système d'Authentification
- Inscription avec photo de profil et couverture
- Validation des données
- Persistance des sessions

### Feed Interactif
- Création de posts multimédia
- Interactions sociales complètes
- Stories et contenus éphémères

### Lecteur Vidéo Avancé
- Support multi-plateformes
- Contrôles personnalisés
- Navigation intuitive

### Messagerie Temps Réel
- Chat privé
- Appels audio/vidéo
- Notifications push

### Recherche Intelligente
- Recherche globale
- Filtres avancés
- Résultats en temps réel

## 🔧 Configuration

### Variables d'Environnement
```env
VITE_APP_NAME=Nester
VITE_APP_VERSION=1.0.0
```

### Personnalisation
- Modifier les couleurs dans `src/index.css`
- Adapter les thèmes dans les composants
- Configurer les langues dans i18next

## 📱 Responsive Design

La plateforme s'adapte automatiquement à tous les écrans :
- **Mobile** : Interface tactile optimisée
- **Tablette** : Navigation hybride
- **Desktop** : Interface complète avec sidebar

## 🎨 Design System

### Couleurs
- **Primaire** : `#1da1f2` (Bleu)
- **Secondaire** : `#e0245e` (Rouge)
- **Succès** : `#17bf63` (Vert)
- **Fond** : `#0a0a0a` (Noir)
- **Surface** : `#1a1a1a` (Gris foncé)

### Typographie
- **Police** : Inter
- **Tailles** : 12px à 48px
- **Poids** : 300 à 700

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Serveur de Production
```bash
npm run preview
```

## 🔮 Roadmap

### Phase 1 (Actuelle)
- ✅ Authentification complète
- ✅ Interface responsive
- ✅ Posts et vidéos
- ✅ Messagerie basique

### Phase 2 (Prochaine)
- 🔄 Intégration Supabase
- 🔄 Notifications push
- 🔄 Appels vidéo avancés
- 🔄 Stories interactives

### Phase 3 (Future)
- 📅 IA de recommandation
- 📅 Monétisation
- 📅 API publique
- 📅 Applications mobiles

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développeur Principal** : [Votre Nom]
- **Design** : [Nom du Designer]
- **Architecture** : [Nom de l'Architecte]

## 📞 Support

- **Email** : support@nester.com
- **Discord** : [Lien Discord]
- **Documentation** : [Lien Documentation]

---

**Nester** - La plateforme sociale du futur 🚀