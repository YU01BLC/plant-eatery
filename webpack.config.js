const { override, addBabelPreset, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  // Babelプリセットの追加
  addBabelPreset('@babel/preset-react'),
  addBabelPreset('@babel/preset-env'),

  // CSSファイルのローダー設定
  addWebpackModuleRule({
    test: /\.(s?)css$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    exclude: /\.module\.css$/, // .module.css ファイルを除外
  }),

  // .module.css ファイルのローダー設定
  addWebpackModuleRule({
    test: /\.module\.css$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
  })
);
