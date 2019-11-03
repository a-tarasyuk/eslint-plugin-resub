# Disallow state accsess in ReSub `componentWillMount`

## Rule Details

Examples of **incorrect** code for this rule

```ts
class Component extends ComponentBase {
  componentWillMount() {
    const a = this.state.a; // Error: 'this.state' is undefined in 'componentWillMount' callback
    this.state.b; // Error: 'this.state' is undefined in 'componentWillMount' callback
    const { c } = this.state; // Error: 'this.state' is undefined in 'componentWillMount' callback
    const { state } = this; // Error: 'this.state' is undefined in 'componentWillMount' callback
    const fn = () => {
      const a = this.state.a; // Error: 'this.state' is undefined in 'componentWillMount' callback
    };
    fn();
  }
  render() {}
}
```

Examples of **correct** code for this rule

```ts
class Component extends ComponentBase {
  componentWillMount() {}
  render() {}
}
```
