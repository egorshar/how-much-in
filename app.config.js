const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  name: IS_DEV ? 'How Much In (Dev)' : 'How Much In',
  slug: 'howmuchin',
  version: '1.0.4',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splashscreen.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: IS_DEV
      ? 'com.egorshar.howmuchin.dev'
      : 'com.egorshar.howmuchin',
    buildNumber: '13',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    versionCode: 3,
    jsEngine: 'hermes',
    package: IS_DEV ? 'com.egorshar.howmuchin.dev' : 'com.egorshar.howmuchin',
    softwareKeyboardLayoutMode: 'pan',
  },
  extra: {
    eas: {
      projectId: 'b81bfa50-6a4b-47af-a5ca-ef20db0873be',
    },
  },
  plugins: ['expo-font', 'expo-localization'],
};
