module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:import/recommended',
        'plugin:node/recommended',
        'prettier',
    ],
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_' },
        ],
        'node/no-missing-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'node/shebang': 'off',
    },
};
