import antfu from '@antfu/eslint-config'

export default antfu(
  {
    rules: {
      'no-console': 'warn',
      'curly': 'off',
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    },
  },
)
