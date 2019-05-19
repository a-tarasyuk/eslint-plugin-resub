import { RuleTester as ESLintRuleTester } from 'eslint';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rule from '../../src/rules/no-state-access';

const RuleTester: TSESLint.RuleTester = ESLintRuleTester as any;
const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('incorrect-state-access', rule, {
  valid: [{
    code: `
      class Component extends ComponentBase {
        componentWillMount() {}
      }
    `,
  }],

  invalid: [{
    code: `
        class Component extends ComponentBase {
            componentWillMount() {
                const a = this.state.a;
                this.state.b;
                const { c } = this.state;
                const { state } = this;
                const fn = () => {
                    const a = this.state.a;
                }
                fn();
            }
        }
    `,

    errors: [{
      messageId: 'stateAccsessError',
    }, {
      messageId: 'stateAccsessError',
    }, {
      messageId: 'stateAccsessError',
    }, {
      messageId: 'stateAccsessError',
    }, {
      messageId: 'stateAccsessError',
    }],
  }],
});
