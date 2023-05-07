module.exports = function (api) {
  api.cache(true);
  return {
    env: { production: { plugins: ['react-native-paper/babel'] } },
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@Assets': './assets',
            '@Components': './src/components',
            '@Providers': './src/providers',
            '@Screens': './src/screens',
            '@Utils': './src/utils',
          },
          extensions: ['.ts', '.tsx'],
        },
      ],
      ['module:react-native-dotenv'],
    ],
    presets: ['babel-preset-expo'],
  };
};
