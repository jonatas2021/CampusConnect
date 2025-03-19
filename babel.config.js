module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',  // Este é o nome do módulo a ser importado
          path: '.env',         // Caminho para o arquivo .env (padrão é .env)
        },
      ],
    ],
  };
  