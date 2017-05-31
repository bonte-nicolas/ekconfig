# ekconfig

[![NPM version][npm-image]][npm-url]

A lightweight configuration module powered by yaml.

## Installation

Using yarn

```
yarn add ekconfig
```

Or npm

```
npm install ekconfig
```

## Usage

This module assumes all your configuration is defined in a single directory:

```
├─ conf/
   ├─ base.yaml        # the base configuration
   ├─ env_mapping.yaml # defines mapping between env vars and config keys
   └─ dev.yaml         # loaded if NODE_ENV is `dev`
```

[npm-image]: https://img.shields.io/npm/v/ekconfig.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ekconfig
