import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils';

export default createRule({
  name: 'no-state-access',
  meta: {
    docs: {
      description: `Disallow state accsess in ReSub 'componentWillMount'`,
      category: 'Possible Errors',
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

    let isReSubComponent = false;
    let isComponentWillMount = false;

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

    const enterMethod = (node: TSESTree.MethodDefinition) => {
      if (
        isReSubComponent &&
        node.key.type === AST_NODE_TYPES.Identifier &&
        node.key.name === 'componentWillMount'
      ) {
        isComponentWillMount = true;
      }
    }

    const exitMethod = () => {
      isComponentWillMount = false;
    }

    const getStateNode = (node: TSESTree.Node): TSESTree.Identifier | undefined => {
      const {
        VariableDeclarator,
        MemberExpression,
        ObjectPattern,
        Identifier,
        Property,
      } = AST_NODE_TYPES;

      if (node.type === MemberExpression && node.property.type === Identifier && isState(node.property.name)) {
        return node.property;
      }

      if (node.type === VariableDeclarator && node.id && node.id.type === ObjectPattern) {
        const property = node.id.properties
          .find((property) => property.type === Property && property.key.type === Identifier && isState(property.key.name));

        if (property && property.type === Property && property.key.type === Identifier) {
          return property.key;
        }
      }

      return undefined;
    }

    const validate = (node: TSESTree.ThisExpression) => {
      if (!isComponentWillMount) {
        return;
      }

      if (node.parent) {
        const stateNode = getStateNode(node.parent);
        if (stateNode) {
          context.report({ messageId: 'stateAccsessError', node: stateNode });
        }
      }
    }

    return {
      ClassDeclaration: enterClass,
      'ClassDeclaration:exit': exitClass,
      MethodDefinition: enterMethod,
      'MethodDefinition:exit': exitMethod,
      ThisExpression: validate,
    };
  },
});
