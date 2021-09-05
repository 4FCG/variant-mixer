module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "react-app",
        "react-app/jest",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:testing-library/react",
        "plugin:jest-dom/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "testing-library",
        "jest-dom"
    ],
    "rules": {
        "testing-library/no-render-in-setup": "error",
        "testing-library/no-wait-for-empty-callback": "error",
        "testing-library/prefer-explicit-assert": "error",
        "testing-library/prefer-presence-queries": "error",
        "testing-library/prefer-screen-queries": "error",
        "testing-library/prefer-wait-for": "error"
    }
};
