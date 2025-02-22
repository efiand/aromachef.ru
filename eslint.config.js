import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

const scriptName = process?.env?.npm_lifecycle_event || '';
const strictMode = scriptName.includes('lint') || scriptName.includes('build');

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	perfectionist.configs['recommended-natural'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'arrow-body-style': 'error',
			'consistent-return': 'error',
			'curly': 'error',
			'default-case-last': 'error',
			'eqeqeq': 'error',
			'func-style': ['error', 'declaration'],
			'no-console': [strictMode ? 'warn' : 'off', { allow: ['error', 'info'] }],
			'no-debugger': strictMode ? 'warn' : 'off',
			'no-duplicate-imports': 'error',
			'no-else-return': 'error',
			'no-extra-boolean-cast': 'error',
			'no-irregular-whitespace': 'off',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			'no-loop-func': 'error',
			'no-negated-condition': 'error',
			'no-return-assign': 'error',
			'no-self-compare': 'error',
			'no-useless-catch': 'error',
			'no-useless-rename': 'error',
			'no-useless-return': 'error',
			'object-shorthand': [
				'error',
				'always',
				{ avoidExplicitReturnArrows: true }
			],
			'prefer-destructuring': 'error',
			'prefer-rest-params': 'error',
			'prefer-spread': 'error',
			'prefer-template': 'error',
			'require-await': 'error',
			'sort-vars': 'error',
			'svelte/no-at-html-tags': 'off',
			'yoda': 'error'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', '*.min.*']
	}
);
