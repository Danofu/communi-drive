module.exports = function (api) {
  api.cache(true);
  return {
    env: { production: { plugins: ['react-native-paper/babel'] } },
    plugins: [
      [
        'module-resolver',
        {
          alias: { '@Assets': './assets', '@Components': './src/components', '@Screens': './src/screens' },
          extensions: ['.ts', '.tsx'],
        },
      ],
    ],
    presets: ['babel-preset-expo'],
  };
};
