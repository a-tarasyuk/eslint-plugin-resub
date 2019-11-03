export default {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['resub'],
  rules: {
    'resub/no-state-access': 'error',
    'resub/override-calls-super': 'error',
  },
};
