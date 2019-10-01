import { RuleTester } from '../support/RuleTester';
import rule from '../../src/rules/override-calls-super';

const ruleTester = new RuleTester({
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run('override-calls-super', rule, {
  valid: [
    {
      code: `
class Component extends ComponentBase {
  componentWillMount() {
    super.componentWillMount();
  }
}
      `,
    },
    {
      code: `
class Component {
  componentWillMount() {}
}
      `,
    },
    {
      code: `
class Component {
  UNSAFE_componentWillMount() {}
}
      `,
    },
  ],

  invalid: [
    {
      code: `
class Component extends ComponentBase {
  componentWillMount() {}
}
      `,
      errors: [
        {
          messageId: 'callSuperError',
          data: { methodName: 'componentWillMount' },
        },
      ],
    },
    {
      code: `
class Component extends ComponentBase {
  componentWillMount() {
    this._isMounted = true;
  }
}
      `,
      errors: [
        {
          messageId: 'callSuperError',
          data: { methodName: 'componentWillMount' },
        },
      ],
    },
    {
      code: `
class Component extends ComponentBase {
  UNSAFE_componentWillMount() {
    this._isMounted = true;
  }
}
      `,
      errors: [
        {
          messageId: 'callSuperError',
          data: { methodName: 'UNSAFE_componentWillMount' },
        },
      ],
    },
  ],
});
