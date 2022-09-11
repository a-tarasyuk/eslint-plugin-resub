import {
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/utils';
import { createRule, isReSubComponent } from '../utils';

const reactLifecycleMethods = [
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
];

export default createRule({
  name: 'override-calls-super',
  meta: {
    docs: {
      description: `Require 'super' calls in overridden methods`,
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
    const isSuperCall = (statement: TSESTree.Statement | undefined): boolean =>
      statement?.type === AST_NODE_TYPES.ExpressionStatement &&
      statement.expression.type === AST_NODE_TYPES.CallExpression &&
      statement.expression.callee.type === AST_NODE_TYPES.MemberExpression &&
      statement.expression.callee.object.type === AST_NODE_TYPES.Super;

    const validate = (node: TSESTree.MethodDefinition): void => {
      if (
        node.key.type !== AST_NODE_TYPES.Identifier ||
        node.value.type !== AST_NODE_TYPES.FunctionExpression ||
        !(
          node.value.body &&
          node.value.body.type === AST_NODE_TYPES.BlockStatement
        )
      ) {
        return;
      }

      if (
        !(node.static && node.key.name === 'getDerivedStateFromProps') &&
        !reactLifecycleMethods.includes(node.key.name)
      ) {
        return;
      }

      if (!isReSubComponent(context.getScope())) {
        return;
      }

      const body = node.value.body.body;
      const firstStatement = body[0];

      if (!isSuperCall(firstStatement)) {
        context.report({
          messageId: body.some(isSuperCall)
            ? 'superShouldBeFirstStatement'
            : 'callSuperError',
          node,
          data: { methodName: node.key.name },
        });
      }
    };

    return {
      MethodDefinition: validate,
    };
  },
});
