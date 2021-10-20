module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: [
        'plugin:react/recommended',
        'standard',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
        'react-app/jest',
        'eslint:recommended',
        'react-app'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        'react',
        'testing-library',
        'jest-dom'
    ],
    rules: {
        'testing-library/no-render-in-setup': 'error',
        'testing-library/no-wait-for-empty-callback': 'error',
        'testing-library/prefer-explicit-assert': 'error',
        'testing-library/prefer-presence-queries': 'error',
        'testing-library/prefer-screen-queries': 'error',
        'testing-library/prefer-wait-for': 'error',
        semi: [2, 'always'],
        indent: ['error', 4]
    }
};
