module.exports = {
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'airbnb/hooks',
    // ルールをすべて有効にする
    'eslint:all',
    // 'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
    'import/extenstions': ['.js', '.jsx', '.ts', '.tsx'],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'import/extensions': [
      'error',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        css: 'always',
      },
    ],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'no-void': [
      'error',
      {
        allowAsStatement: true,
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '{react,react-dom/**,react-router-dom}',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '@src/**',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
    /**
     * 変数をまとめて宣言するのを禁止するルール(デフォルトは許可)
     * 新たに追加
     */
    'one-var': ['error', 'never'],
    /**
     * 一度も使用していないletはconstに書き換えなければならない。
     * 開発中に制限に引っ掛かりがちなのでwarnにとどめる
     */
    'prefer-const': 'warn',
    /**一重引用符を含まないすべての JSX 属性値に対して一重引用符の使用しなければいけない */
    'jsx-quotes': ['error', 'prefer-single'],
    /**
     * 複数行コメントを書く時には // ではなく /** にしなければいけない。
     * 無効化
     */
    'multiline-comment-style': 'off',
    /**
     * TODOコメントを禁止するルール。
     * warnにして注意を促す
     */
    'no-warning-comments': 'warn',
    /**
     * オブジェクトのキーの順番をアルファベット順にする
     * ルールを使用したい箇所で個別に /* eslint sort-keys:warn *\/ を追加する方が適切。
     */
    'sort-keys': 'off',
    /** 関数ブロックで宣言されるステートメントの数に制限をかける。*/
    'max-statements': 'warn',
    /** 関数ブロックで許可される行数に制限をかける。既存からの移植案件で有効化は難しいので無効にする。 */
    'max-lines-per-function': 'off',
    /** ファイルの最大行数に制限をかける。*/
    'max-lines': 'warn',
    /** マジックナンバーを禁止する。*/
    'no-magic-numbers': 'off',
    /**
     * アロー関数で戻り値を直接渡す場合にはreturnを付けず、直接値を渡すようにする
     * @example
     * error: ()=>{ return 'text' }
     * ok: () => 'text'
     */
    'arrow-body-style': 'error',
    /** 正規表現でuフラグの使用を強制し、構文エラーの正規表現を無効化する */
    'require-unicode-regexp': 'error',
    /** 三項演算子を許可しないルール。無効化 */
    'no-ternary': 'off',
    /** コメントの頭文字を大文字にすることを強制するルール。無効化 */
    'capitalized-comments': 'off',
    /**
     * 条件分岐が複雑すぎるのを禁止するルール
     * 基本的には短くできないかを考えるためwarnにする。
     * どうしてもできない場合には
     * // eslint-disable-next-line
     * を付ける。
     */
    complexity: ['warn', 20],
    /**
     * スペースの含まれていないコメント禁止する
     * @example
     * warn: //HOGE
     * ok: // HOGE
     */
    'spaced-comment': 'warn',
    /**
     * インラインコメントを禁止するルール。
     * errorにするほどではないが、書き方は統一するためwarnにする。
     */
    'no-inline-comments': 'warn',
    /**
     * インラインコメントの位置に関するルール。
     * デフォルトでは上に記述する設定になっている。
     * errorにするほどではないが、書き方は統一するためwarnにする。
     */
    'line-comment-position': 'warn',
    /**
     * 関数等で宣言される前に使用するのを禁止する。
     */
    'no-use-before-define': 'off',
    /**
     * JSはキャメルケースで宣言すべきというルール。
     */
    camelcase: 'warn',
    /**
     * console.logを使用してはいけないというルール
     * 当システムでもconsole.logをラップしたLoggerを使用すると想定。
     * 開発者個人のローカルデバッグでは扱いやすいのでwarnにする。
     */
    'no-console': 'warn',
    /**
     * importする順番を一定のルールに基づく形にする。
     * --fixオプションに対応しているので、コミット前にformatをかける
     */
    'sort-imports': 0,
    'import/order': [
      'warn',
      {
        /** ファイル種別に応じてimport順を変更 */
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object', 'type'],
        /** importの改行処理　無効 */
        'newlines-between': 'never',
        /** アルファベット順に並び替える */
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        /** パターンマッチしたものをグループにする */
        pathGroups: [
          {
            /** react関連をexternalより上に配置 */
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        /**　未割り当てのimportをimportブロックの内部に含めるようにする */
        warnOnUnassignedImports: true,
      },
    ],
    /**
     * 変数名は2文字以上なければならない。
     * forのiなどもあり好みはあるが、warnにする。
     */
    'id-length': 'warn',
    /** 末尾のスペースを許容しない */
    'no-trailing-spaces': 'warn',
    /** レギュラーな空白意外許容しない */
    'no-irregular-whitespace': 'error',
  },
};
