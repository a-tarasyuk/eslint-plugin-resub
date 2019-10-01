import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

const methodsMap = new Map([
  'UNSAFE_componentWillReceiveProps',
  'UNSAFE_componentWillUpdate',
  'UNSAFE_componentWillMount',

  'componentWillReceiveProps',
  'componentWillUnmount',
  'componentWillUpdate',
  'componentWillMount',
  'componentDidUpdate',
  'componentDidMount',
  '_buildInitialState',
].map(name => [name, true]));

export default createRule({
  name: 'override-calls-super',
  meta: {
    docs: {
      description: `require 'super' calls in overridden methods`,
      category: 'Possible Errors',
      recommended: 'error',
    },
    messages: {
      callSuperError: `Method override must call 'super.{{methodName}}'`,
      superShouldBeFirstStatement: `Method override must call 'super.{{methodName}}' in the top-level statements of the method body`,
    },
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],

  create: function (context) {
    let isReSubComponent = false;

    const enterClass = (node: TSESTree.ClassDeclaration) => {
      if (
        node.superClass &&
        node.superClass.type === AST_NODE_TYPES.Identifier &&
        /ComponentBase/g.test(node.superClass.name)
      ) {
        isReSubComponent = true;
      }
    };

    const exitClass = () => {
      isReSubComponent = false;
    };

    const isSuperCall = (statement: TSESTree.Statement | undefined): boolean => (
      !!statement
        && statement.type === AST_NODE_TYPES.ExpressionStatement
        && statement.expression.type === AST_NODE_TYPES.CallExpression
        && statement.expression.callee.type === AST_NODE_TYPES.MemberExpression
        && statement.expression.callee.object.type === AST_NODE_TYPES.Super
    );

    const isFirstSuperCallStatement = (block: TSESTree.BlockStatement | null | undefined): boolean => (
      !!block && isSuperCall(block.body[0])
    );

    const hasSupperCall = (block: TSESTree.BlockStatement | null | undefined): boolean => (
      !!block && block.body.some(isSuperCall)
    );

    const validate = (node: TSESTree.MethodDefinition): void => {
      if (!isReSubComponent) {
        return;
      }

      if (
        node.key.type === AST_NODE_TYPES.Identifier &&
        methodsMap.has(node.key.name) &&
        !isFirstSuperCallStatement(node.value.body)
      ) {
        context.report({
          messageId: hasSupperCall(node.value.body) ? 'superShouldBeFirstStatement' : 'callSuperError',
          node,
          data: { methodName: node.key.name },
        });
      }
    };

    return {
      ClassDeclaration: enterClass,
      'ClassDeclaration:exit': exitClass,
      MethodDefinition: validate,
    };
  },
});
