# ekconfig

[![NPM version][npm-image]][npm-url]

A lightweight configuration module powered by yaml.

## Installation

Using yarn

```
yarn add @ekino/config
```

Or npm

```
npm install @ekino/config
```

## Usage

This module assumes all your configuration is defined in a single directory:

```
├─ conf/
   ├─ base.yaml        # the base configuration
   ├─ env_mapping.yaml # defines mapping between env vars and config keys
   └─ dev.yaml         # loaded if NODE_ENV is `dev`
```

> Be warned that this module uses synchronous file reads in order to be easily required.

[npm-image]: https://img.shields.io/npm/v/@ekino/config.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@ekino/config
