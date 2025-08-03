import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      // État
      currentLanguage: 'fr',
      availableLanguages: [
        { code: 'fr', name: 'Français', flag: '🇫🇷', direction: 'ltr' },
        { code: 'en', name: 'English', flag: '🇺🇸', direction: 'ltr' },
        { code: 'es', name: 'Español', flag: '🇪🇸', direction: 'ltr' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
        { code: 'pt', name: 'Português', flag: '🇵🇹', direction: 'ltr' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺', direction: 'ltr' },
        { code: 'zh', name: '中文', flag: '🇨🇳', direction: 'ltr' },
        { code: 'ja', name: '日本語', flag: '🇯🇵', direction: 'ltr' },
        { code: 'ko', name: '한국어', flag: '🇰🇷', direction: 'ltr' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱', direction: 'ltr' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱', direction: 'ltr' },
        { code: 'sv', name: 'Svenska', flag: '🇸🇪', direction: 'ltr' },
        { code: 'da', name: 'Dansk', flag: '🇩🇰', direction: 'ltr' },
        { code: 'no', name: 'Norsk', flag: '🇳🇴', direction: 'ltr' },
        { code: 'fi', name: 'Suomi', flag: '🇫🇮', direction: 'ltr' },
        { code: 'cs', name: 'Čeština', flag: '🇨🇿', direction: 'ltr' },
        { code: 'sk', name: 'Slovenčina', flag: '🇸🇰', direction: 'ltr' },
        { code: 'hu', name: 'Magyar', flag: '🇭🇺', direction: 'ltr' },
        { code: 'ro', name: 'Română', flag: '🇷🇴', direction: 'ltr' },
        { code: 'bg', name: 'Български', flag: '🇧🇬', direction: 'ltr' },
        { code: 'hr', name: 'Hrvatski', flag: '🇭🇷', direction: 'ltr' },
        { code: 'sl', name: 'Slovenščina', flag: '🇸🇮', direction: 'ltr' },
        { code: 'et', name: 'Eesti', flag: '🇪🇪', direction: 'ltr' },
        { code: 'lv', name: 'Latviešu', flag: '🇱🇻', direction: 'ltr' },
        { code: 'lt', name: 'Lietuvių', flag: '🇱🇹', direction: 'ltr' },
        { code: 'mt', name: 'Malti', flag: '🇲🇹', direction: 'ltr' },
        { code: 'ga', name: 'Gaeilge', flag: '🇮🇪', direction: 'ltr' },
        { code: 'cy', name: 'Cymraeg', flag: '🇬🇧', direction: 'ltr' },
        { code: 'eu', name: 'Euskara', flag: '🇪🇸', direction: 'ltr' },
        { code: 'ca', name: 'Català', flag: '🇪🇸', direction: 'ltr' },
        { code: 'gl', name: 'Galego', flag: '🇪🇸', direction: 'ltr' },
        { code: 'is', name: 'Íslenska', flag: '🇮🇸', direction: 'ltr' },
        { code: 'mk', name: 'Македонски', flag: '🇲🇰', direction: 'ltr' },
        { code: 'sq', name: 'Shqip', flag: '🇦🇱', direction: 'ltr' },
        { code: 'sr', name: 'Српски', flag: '🇷🇸', direction: 'ltr' },
        { code: 'bs', name: 'Bosanski', flag: '🇧🇦', direction: 'ltr' },
        { code: 'me', name: 'Crnogorski', flag: '🇲🇪', direction: 'ltr' },
        { code: 'uk', name: 'Українська', flag: '🇺🇦', direction: 'ltr' },
        { code: 'be', name: 'Беларуская', flag: '🇧🇾', direction: 'ltr' },
        { code: 'kk', name: 'Қазақша', flag: '🇰🇿', direction: 'ltr' },
        { code: 'ky', name: 'Кыргызча', flag: '🇰🇬', direction: 'ltr' },
        { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿', direction: 'ltr' },
        { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯', direction: 'ltr' },
        { code: 'mn', name: 'Монгол', flag: '🇲🇳', direction: 'ltr' },
        { code: 'ka', name: 'ქართული', flag: '🇬🇪', direction: 'ltr' },
        { code: 'hy', name: 'Հայերեն', flag: '🇦🇲', direction: 'ltr' },
        { code: 'az', name: 'Azərbaycanca', flag: '🇦🇿', direction: 'ltr' },
        { code: 'fa', name: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
        { code: 'ur', name: 'اردو', flag: '🇵🇰', direction: 'rtl' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩', direction: 'ltr' },
        { code: 'si', name: 'සිංහල', flag: '🇱🇰', direction: 'ltr' },
        { code: 'my', name: 'မြန်မာ', flag: '🇲🇲', direction: 'ltr' },
        { code: 'th', name: 'ไทย', flag: '🇹🇭', direction: 'ltr' },
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr' },
        { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭', direction: 'ltr' },
        { code: 'lo', name: 'ລາວ', flag: '🇱🇦', direction: 'ltr' },
        { code: 'ne', name: 'नेपाली', flag: '🇳🇵', direction: 'ltr' },
        { code: 'dz', name: 'ཇོང་ཁ', flag: '🇧🇹', direction: 'ltr' },
        { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', direction: 'ltr' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', direction: 'ltr' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳', direction: 'ltr' },
        { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', direction: 'ltr' },
        { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', direction: 'ltr' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', direction: 'ltr' },
        { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳', direction: 'ltr' },
        { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', direction: 'ltr' },
        { code: 'mr', name: 'मराठी', flag: '🇮🇳', direction: 'ltr' },
        { code: 'sa', name: 'संस्कृतम्', flag: '🇮🇳', direction: 'ltr' },
        { code: 'sd', name: 'سنڌي', flag: '🇵🇰', direction: 'rtl' },
        { code: 'ps', name: 'پښتو', flag: '🇦🇫', direction: 'rtl' },
        { code: 'ku', name: 'Kurdî', flag: '🇮🇶', direction: 'rtl' },
        { code: 'he', name: 'עברית', flag: '🇮🇱', direction: 'rtl' },
        { code: 'yi', name: 'יידיש', flag: '🇮🇱', direction: 'rtl' },
        { code: 'am', name: 'አማርኛ', flag: '🇪🇹', direction: 'ltr' },
        { code: 'sw', name: 'Kiswahili', flag: '🇹🇿', direction: 'ltr' },
        { code: 'zu', name: 'isiZulu', flag: '🇿🇦', direction: 'ltr' },
        { code: 'af', name: 'Afrikaans', flag: '🇿🇦', direction: 'ltr' },
        { code: 'xh', name: 'isiXhosa', flag: '🇿🇦', direction: 'ltr' },
        { code: 'st', name: 'Sesotho', flag: '🇿🇦', direction: 'ltr' },
        { code: 'tn', name: 'Setswana', flag: '🇿🇦', direction: 'ltr' },
        { code: 've', name: 'Tshivenda', flag: '🇿🇦', direction: 'ltr' },
        { code: 'ts', name: 'Xitsonga', flag: '🇿🇦', direction: 'ltr' },
        { code: 'ss', name: 'siSwati', flag: '🇿🇦', direction: 'ltr' },
        { code: 'nr', name: 'isiNdebele', flag: '🇿🇦', direction: 'ltr' },
        { code: 'sn', name: 'chiShona', flag: '🇿🇼', direction: 'ltr' },
        { code: 'ny', name: 'Chichewa', flag: '🇲🇼', direction: 'ltr' },
        { code: 'lg', name: 'Luganda', flag: '🇺🇬', direction: 'ltr' },
        { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', direction: 'ltr' },
        { code: 'rw', name: 'Kirundi', flag: '🇧🇮', direction: 'ltr' },
        { code: 'so', name: 'Soomaali', flag: '🇸🇴', direction: 'ltr' },
        { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹', direction: 'ltr' },
        { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷', direction: 'ltr' },
        { code: 'ar', name: 'العربية', flag: '🇪🇬', direction: 'rtl' },
        { code: 'he', name: 'עברית', flag: '🇮🇱', direction: 'rtl' },
        { code: 'fa', name: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
        { code: 'ur', name: 'اردو', flag: '🇵🇰', direction: 'rtl' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩', direction: 'ltr' },
        { code: 'si', name: 'සිංහල', flag: '🇱🇰', direction: 'ltr' },
        { code: 'my', name: 'မြန်မာ', flag: '🇲🇲', direction: 'ltr' },
        { code: 'th', name: 'ไทย', flag: '🇹🇭', direction: 'ltr' },
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr' },
        { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭', direction: 'ltr' },
        { code: 'lo', name: 'ລາວ', flag: '🇱🇦', direction: 'ltr' },
        { code: 'ne', name: 'नेपाली', flag: '🇳🇵', direction: 'ltr' },
        { code: 'dz', name: 'ཇོང་ཁ', flag: '🇧🇹', direction: 'ltr' },
        { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', direction: 'ltr' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', direction: 'ltr' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳', direction: 'ltr' },
        { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', direction: 'ltr' },
        { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', direction: 'ltr' },
        { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', direction: 'ltr' },
        { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳', direction: 'ltr' },
        { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', direction: 'ltr' },
        { code: 'mr', name: 'मराठी', flag: '🇮🇳', direction: 'ltr' },
        { code: 'sa', name: 'संस्कृतम्', flag: '🇮🇳', direction: 'ltr' },
        { code: 'sd', name: 'سنڌي', flag: '🇵🇰', direction: 'rtl' },
        { code: 'ps', name: 'پښتو', flag: '🇦🇫', direction: 'rtl' },
        { code: 'ku', name: 'Kurdî', flag: '🇮🇶', direction: 'rtl' },
        { code: 'he', name: 'עברית', flag: '🇮🇱', direction: 'rtl' },
        { code: 'yi', name: 'יידיש', flag: '🇮🇱', direction: 'rtl' },
        { code: 'am', name: 'አማርኛ', flag: '🇪🇹', direction: 'ltr' },
        { code: 'sw', name: 'Kiswahili', flag: '🇹🇿', direction: 'ltr' },
        { code: 'zu', name: 'isiZulu', flag: '🇿🇦', direction: 'ltr' },
        { code: 'af', name: 'Afrikaans', flag: '🇿🇦', direction: 'ltr' },
        { code: 'xh', name: 'isiXhosa', flag: '🇿🇦', direction: 'ltr' },
        { code: 'st', name: 'Sesotho', flag: '🇿🇦', direction: 'ltr' },
        { code: 'tn', name: 'Setswana', flag: '🇿🇦', direction: 'ltr' },
        { code: 've', name: 'Tshivenda', flag: '🇿🇦', direction: 'ltr' },
        { code: 'ts', name: 'Xitsonga', flag: '🇿🇦', direction: 'ltr' },
        { code: 'ss', name: 'siSwati', flag: '🇿🇦', direction: 'ltr' },
        { code: 'nr', name: 'isiNdebele', flag: '🇿🇦', direction: 'ltr' },
        { code: 'sn', name: 'chiShona', flag: '🇿🇼', direction: 'ltr' },
        { code: 'ny', name: 'Chichewa', flag: '🇲🇼', direction: 'ltr' },
        { code: 'lg', name: 'Luganda', flag: '🇺🇬', direction: 'ltr' },
        { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', direction: 'ltr' },
        { code: 'rw', name: 'Kirundi', flag: '🇧🇮', direction: 'ltr' },
        { code: 'so', name: 'Soomaali', flag: '🇸🇴', direction: 'ltr' },
        { code: 'om', name: 'Afaan Oromoo', flag: '🇪🇹', direction: 'ltr' },
        { code: 'ti', name: 'ትግርኛ', flag: '🇪🇷', direction: 'ltr' }
      ],
      fallbackLanguage: 'en',
      autoDetect: true,
      direction: 'ltr',

      // Actions
      setLanguage: (languageCode) => {
        const language = get().availableLanguages.find(lang => lang.code === languageCode);
        if (!language) {
          console.warn(`Langue non supportée: ${languageCode}`);
          return;
        }

        set({ 
          currentLanguage: languageCode,
          direction: language.direction
        });

        // Changer la langue dans i18n
        i18n.changeLanguage(languageCode);

        // Appliquer la direction du texte
        document.documentElement.setAttribute('dir', language.direction);
        document.documentElement.setAttribute('lang', languageCode);

        // Stocker la préférence
        localStorage.setItem('preferred-language', languageCode);
      },

      setFallbackLanguage: (languageCode) => {
        set({ fallbackLanguage: languageCode });
        i18n.options.fallbackLng = languageCode;
      },

      setAutoDetect: (enabled) => {
        set({ autoDetect: enabled });
      },

      // Initialiser la langue
      initializeLanguage: () => {
        const { autoDetect, fallbackLanguage } = get();
        
        let languageToUse = fallbackLanguage;

        if (autoDetect) {
          // Détecter la langue du navigateur
          const browserLanguage = navigator.language || navigator.userLanguage;
          const detectedLanguage = browserLanguage.split('-')[0];
          
          // Vérifier si la langue détectée est supportée
          const isSupported = get().availableLanguages.some(lang => lang.code === detectedLanguage);
          
          if (isSupported) {
            languageToUse = detectedLanguage;
          }

          // Vérifier la préférence stockée
          const storedLanguage = localStorage.getItem('preferred-language');
          if (storedLanguage) {
            const isStoredSupported = get().availableLanguages.some(lang => lang.code === storedLanguage);
            if (isStoredSupported) {
              languageToUse = storedLanguage;
            }
          }
        }

        get().setLanguage(languageToUse);
      },

      // Obtenir la langue actuelle
      getCurrentLanguage: () => {
        const { currentLanguage } = get();
        return get().availableLanguages.find(lang => lang.code === currentLanguage);
      },

      // Obtenir les langues populaires
      getPopularLanguages: () => {
        const popularCodes = ['fr', 'en', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'];
        return get().availableLanguages.filter(lang => popularCodes.includes(lang.code));
      },

      // Obtenir les langues par région
      getLanguagesByRegion: (region) => {
        const regionMap = {
          europe: ['fr', 'en', 'de', 'it', 'es', 'pt', 'ru', 'nl', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'mt', 'ga', 'cy', 'eu', 'ca', 'gl', 'is', 'mk', 'sq', 'sr', 'bs', 'me', 'uk', 'be', 'kk', 'ky', 'uz', 'tg', 'mn', 'ka', 'hy', 'az'],
          asia: ['zh', 'ja', 'ko', 'hi', 'bn', 'si', 'my', 'th', 'vi', 'km', 'lo', 'ne', 'dz', 'ml', 'ta', 'te', 'kn', 'gu', 'pa', 'or', 'as', 'mr', 'sa', 'sd', 'ps', 'ku', 'he', 'yi', 'am', 'sw', 'zu', 'af', 'xh', 'st', 'tn', 've', 'ts', 'ss', 'nr', 'sn', 'ny', 'lg', 'rw', 'so', 'om', 'ti'],
          africa: ['ar', 'sw', 'zu', 'af', 'xh', 'st', 'tn', 've', 'ts', 'ss', 'nr', 'sn', 'ny', 'lg', 'rw', 'so', 'om', 'ti', 'am'],
          americas: ['en', 'es', 'pt', 'fr'],
          oceania: ['en', 'fr']
        };

        const codes = regionMap[region] || [];
        return get().availableLanguages.filter(lang => codes.includes(lang.code));
      },

      // Rechercher des langues
      searchLanguages: (query) => {
        const { availableLanguages } = get();
        const lowerQuery = query.toLowerCase();
        
        return availableLanguages.filter(lang => 
          lang.name.toLowerCase().includes(lowerQuery) ||
          lang.code.toLowerCase().includes(lowerQuery)
        );
      },

      // Obtenir les statistiques des langues
      getLanguageStats: () => {
        const { availableLanguages } = get();
        const total = availableLanguages.length;
        const ltr = availableLanguages.filter(lang => lang.direction === 'ltr').length;
        const rtl = availableLanguages.filter(lang => lang.direction === 'rtl').length;
        
        return {
          total,
          ltr,
          rtl,
          percentage: {
            ltr: Math.round((ltr / total) * 100),
            rtl: Math.round((rtl / total) * 100)
          }
        };
      },

      // Vérifier si une langue est supportée
      isLanguageSupported: (languageCode) => {
        return get().availableLanguages.some(lang => lang.code === languageCode);
      },

      // Obtenir la direction du texte pour une langue
      getTextDirection: (languageCode) => {
        const language = get().availableLanguages.find(lang => lang.code === languageCode);
        return language?.direction || 'ltr';
      },

      // Traduire un texte
      translate: (key, options = {}) => {
        return i18n.t(key, options);
      },

      // Obtenir la langue du navigateur
      getBrowserLanguage: () => {
        return navigator.language || navigator.userLanguage || 'en';
      },

      // Obtenir les langues préférées du navigateur
      getBrowserLanguages: () => {
        return navigator.languages || [navigator.language || 'en'];
      },

      // Réinitialiser aux valeurs par défaut
      resetToDefaults: () => {
        const defaults = {
          currentLanguage: 'fr',
          fallbackLanguage: 'en',
          autoDetect: true,
          direction: 'ltr'
        };
        
        set(defaults);
        get().initializeLanguage();
      },

      // Getters utiles
      getCurrentLanguageCode: () => get().currentLanguage,
      
      getCurrentLanguageName: () => {
        const currentLang = get().getCurrentLanguage();
        return currentLang?.name || 'Unknown';
      },
      
      getCurrentLanguageFlag: () => {
        const currentLang = get().getCurrentLanguage();
        return currentLang?.flag || '🌐';
      },
      
      getCurrentDirection: () => get().direction,
      
      getFallbackLanguage: () => get().fallbackLanguage,
      
      getAutoDetect: () => get().autoDetect,
      
      getAvailableLanguages: () => get().availableLanguages,
      
      isRTL: () => get().direction === 'rtl',
      
      isLTR: () => get().direction === 'ltr',
      
      getLanguageConfig: () => ({
        currentLanguage: get().currentLanguage,
        fallbackLanguage: get().fallbackLanguage,
        autoDetect: get().autoDetect,
        direction: get().direction,
        availableLanguages: get().availableLanguages.length
      })
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        fallbackLanguage: state.fallbackLanguage,
        autoDetect: state.autoDetect,
        direction: state.direction
      })
    }
  )
);