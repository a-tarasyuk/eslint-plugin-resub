import { RuleTester as ESLintRuleTester } from 'eslint';
import { TSESLint } from '@typescript-eslint/experimental-utils';

export const RuleTester: TSESLint.RuleTester = ESLintRuleTester as any;
