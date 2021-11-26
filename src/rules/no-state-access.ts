import {
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import { createRule, isReSubComponent } from '../utils';

const reactLifecycleMethods = [
  'UNSAFE_componentWillMount',
  'componentWillMount',
];

export default createRule({
  name: 'no-state-access',
  meta: {
    docs: {
      description: `Disallow state accsess in ReSub 'componentWillMount'`,
      recommended: 'error',
    },
    messages: {
      stateAccsessError: `'this.state' is undefined in 'componentWillMount' callback`,
    },
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],

  create: function (context) {
    const isState = (name: string): boolean => name === 'state';
    const stack: boolean[] = [];

    const enterMethod = (node: TSESTree.MethodDefinition): void => {
      const isComponentWillMount =
        node.key.type === AST_NODE_TYPES.Identifier &&
        reactLifecycleMethods.includes(node.key.name) &&
        isReSubComponent(context.getScope());

      stack.push(isComponentWillMount);
    };

    const exitMethod = (): void => {
      stack.pop();
    };

    const getStateNode = (
      node: TSESTree.Node,
    ): TSESTree.Identifier | undefined => {
      const {
        VariableDeclarator,
        MemberExpression,
        ObjectPattern,
        Identifier,
        Property,
      } = AST_NODE_TYPES;

      if (
        node.type === MemberExpression &&
        node.property.type === Identifier &&
        isState(node.property.name)
      ) {
        return node.property;
      }

      if (
        node.type === VariableDeclarator &&
        node.id &&
        node.id.type === ObjectPattern
      ) {
        const property = node.id.properties.find(
          (property) =>
            property.type === Property &&
            property.key.type === Identifier &&
            isState(property.key.name),
        );

        if (property?.type === Property && property.key.type === Identifier) {
          return property.key;
        }
      }

      return undefined;
    };

    const validate = (node: TSESTree.ThisExpression): void => {
      const isComponentWillMount = stack.length && stack[stack.length - 1];
      if (!isComponentWillMount) {
        return;
      }

      if (node.parent) {
        const stateNode = getStateNode(node.parent);
        if (stateNode) {
          context.report({ messageId: 'stateAccsessError', node: stateNode });
        }
      }
    };

    return {
      MethodDefinition: enterMethod,
      'MethodDefinition:exit': exitMethod,
      ThisExpression: validate,
    };
  },
});
