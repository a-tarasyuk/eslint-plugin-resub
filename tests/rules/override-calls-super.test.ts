import { RuleTester as ESLintRuleTester } from 'eslint';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../../src/rules/override-calls-super';

const RuleTester: TSESLint.RuleTester = ESLintRuleTester as any;
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('override-calls-super', rule, {
  valid: [{
    code: `
      class Component extends ComponentBase {
        componentWillMount() {
          super.componentWillMount();
        }
      }
    `,
  }],

  invalid: [{
    code: `
        class Component extends ComponentBase {
            componentWillMount() {}
        }
    `,

    errors: [{
      messageId: 'callSuperError',
      data: { methodName: 'componentWillMount' },
    }],
  }, {
    code: `
        class Component extends ComponentBase {
            componentWillMount() {
              this._isMounted = true;
            }
        }
    `,

    errors: [{
      messageId: 'callSuperError',
      data: { methodName: 'componentWillMount' },
    }],
  }],
});
