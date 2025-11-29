import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default [
	{
		ignores: ['dist/**', 'node_modules/**', '*.js', '*.mjs'],
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			// n8n community node rules - node parameters
			'n8n-nodes-base/node-param-display-name-miscased': 'error',
			'n8n-nodes-base/node-param-description-missing-final-period': 'error',
			'n8n-nodes-base/node-param-description-excess-final-period': 'error',
			'n8n-nodes-base/node-param-default-missing': 'error',
			// n8n community node rules - node class
			'n8n-nodes-base/node-class-description-name-miscased': 'error',
			'n8n-nodes-base/node-class-description-missing-subtitle': 'warn',
			// n8n community node rules - credentials
			'n8n-nodes-base/cred-class-name-unsuffixed': 'error',
			'n8n-nodes-base/cred-class-field-name-unsuffixed': 'error',
			'n8n-nodes-base/cred-class-field-display-name-missing-api': 'error',
			// TypeScript rules
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
];
