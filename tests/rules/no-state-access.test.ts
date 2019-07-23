import { RuleTester } from '../support/RuleTester';
import rule from '../../src/rules/no-state-access';

const ruleTester = new RuleTester({
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('no-state-access', rule, {
  valid: [{
    code: `
      class Component extends ComponentBase {
        componentWillMount() {}
        render() {}
      }

      class Component1 extends ComponentBase {
        componentWillMount() {}
        render() {}
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
        render() {}
      }

      class Component1 extends ComponentBase {
        componentWillMount() {
          const a = this.state.a;
        }
        render() {}
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
    }, {
      messageId: 'stateAccsessError',
    }],
  }],
});
