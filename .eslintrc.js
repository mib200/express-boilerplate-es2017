module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base', 'prettier', 'prettier/standard'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 160,
        jsxBracketSameLine: true,
      },
    ],
    'max-len': [
      2,
      {
        code: 160,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'generator-star-spacing': 0,
  },
};
