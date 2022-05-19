module.exports = {
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
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/member-ordering': ['warning', {
      default: [
        {
          memberType: 'static-field',
          order: 'alphabetically'
        },
        {
          memberType: 'static-method',
          order: 'alphabetically'
        },
        {
          memberType: 'static-get',
          order: 'alphabetically'
        },
        {
          memberType: 'static-set',
          order: 'alphabetically'
        },
        {
          memberType: 'instance-field',
          order: 'alphabetically'
        },
        {
          memberType: 'instance-get',
          order: 'alphabetically'
        },
        {
          memberType: 'instance-set',
          order: 'alphabetically'
        },
        {
          memberType: 'constructor',
          order: 'alphabetically'
        },
        {
          memberType: 'instance-method',
          order: 'alphabetically'
        }
      ]
    }]
  }
};