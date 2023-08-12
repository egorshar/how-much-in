module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: './',
          alias: {
            '@assets': './assets',
            '@constants': './constants',
            '@locales': './locales',
            '@services': './services',
            '@ui': './ui',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
