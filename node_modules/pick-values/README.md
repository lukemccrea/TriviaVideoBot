# pick-values

[![Travis Build Status](https://img.shields.io/travis/phated/pick-values.svg?branch=master&label=travis&style=flat-square)](https://travis-ci.org/phated/pick-values)

Pick an array of values out of an object.

## Usage

```js
var pickValues = require('pick-values');

var result = pickValues({ hello: 'world', foo: 'bar' }, ['hello', 'foo']);
//-> ['world', 'bar']
```

## API

### `pickValues(object, keys)`

Takes an `object` and an array (or single string) of `keys`.
Returns an ordered array of values from each of the specified keys.

## License

MIT
