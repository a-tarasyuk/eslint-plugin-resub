export default {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'no-state-access': 'error',
    'override-calls-super': 'error',
  },
}
