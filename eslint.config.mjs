import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'eqeqeq': ['error', 'always'],
      'semi': ['error', 'always'],             
      'quotes': ['error', 'single'],            
      'indent': ['error', 2],                   
      'comma-dangle': ['error', 'never'],       
      'space-before-function-paren': ['error', 'never']
    }
  }
];
