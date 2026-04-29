module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated/worklets 플러그인은 반드시 맨 마지막에
      'react-native-worklets/plugin',
    ],
  };
};
