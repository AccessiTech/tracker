module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "typescript",
        "jsx-a11y"
    ],
    "rules": {
        "typescript/no-unused-vars": "warn"
    },
    "overrides": [{
        "files": ["**/*.ts", "**/*.tsx"],
        "parser": "@typescript-eslint/parser",
    }]
}
