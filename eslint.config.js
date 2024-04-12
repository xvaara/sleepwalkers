import antfu from '@antfu/eslint-config'

export default antfu(
  {},
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': ['error', {
        order: [['script', 'template'], 'style'],
      }],
    },
  },
)
