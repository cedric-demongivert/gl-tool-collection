export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/ban-types': ['error', {
      types: {
        Function: false
      }
    }],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/member-ordering': ['warn', {
      default: {
        memberTypes: [
          'static-field',
          'static-method',
          'static-get',
          'static-set',
          'instance-field',
          'instance-get',
          'instance-set',
          'constructor',
          'instance-method'
        ],
        order: 'alphabetically-case-insensitive'
      },
      interfaces: {
        memberTypes: [
          'field',
          'constructor',
          'method',
          'signature'
        ],
        order: 'alphabetically-case-insensitive'
      }
    }]
  }
};