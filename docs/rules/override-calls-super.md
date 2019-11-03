# Require 'super' calls in overridden methods

## Rule Details

Examples of **incorrect** code for this rule

```ts
class Component extends ComponentBase {
  componentWillMount() {
    this._isMounted = true;
  }
}
```

Examples of **correct** code for this rule

```ts
class Component extends ComponentBase {
  componentWillMount() {
    super.componentWillMount();
  }
}
```
