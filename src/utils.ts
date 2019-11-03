import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';

export const createRule = ESLintUtils.RuleCreator(() => '');

export const isReSubComponent = (
  scope: TSESLint.Scope.Scope | null,
): boolean => {
  let currentScope = scope;
  while (scope && scope.type !== 'class') {
    currentScope = scope.upper;
  }

  const node = currentScope && currentScope.block;
  if (!node || node.type !== AST_NODE_TYPES.ClassDeclaration) {
    return false;
  }

  const superClass = node.superClass;
  if (!superClass || superClass.type !== AST_NODE_TYPES.Identifier) {
    return false;
  }

  return /ComponentBase/g.test(superClass.name);
};
