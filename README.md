# eslint-plugin-resub

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/a-tarasyuk/eslint-plugin-resub/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/eslint-plugin-resub.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-resub) ![Travis (.com) master](https://img.shields.io/travis/com/a-tarasyuk/eslint-plugin-resub/master.svg?style=flat-square) [![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-resub.svg?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-resub)

## Installation

```
$ npm i eslint eslint-plugin-resub @typescript-eslint/parser --save-dev
```

## Usage

Add `resub` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "resub"
  ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "resub/override-сalls-super": "error",
    "resub/no-state-access": "error",
  }
}
```

Or extend recommended config

```json
{
  "extends": "plugin:resub/recommended"
}
```

## License and Copyright

This software is released under the terms of the [MIT license](https://github.com/a-tarasyuk/eslint-plugin-resub/blob/master/LICENSE.md).