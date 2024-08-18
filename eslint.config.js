const globals = require('globals');
const {configs} = require('@eslint/js');

module.exports = [
    {
        files: ['**/*.js'],
        ignores: ['**/*.config.js'],

        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                console: 'readonly',
            },
        },

        rules: {

            ...configs.recommended.rules,

            'no-console': 'warn',
            eqeqeq: 'error',
            curly: 'error',
            'no-var': 'error',
            'no-unused-vars': ['warn', {vars: 'all', args: 'after-used', ignoreRestSiblings: false}],
        },
    },
];
