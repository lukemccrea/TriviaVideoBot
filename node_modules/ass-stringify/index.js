'use strict';

var pickValues = require('pick-values');


var stringifyDescriptor = {
  comment: function (comment) {
    return ';' + comment.value;
  },
  formatSpec: function (formatSpec) {
    return formatSpec.key + ': ' + formatSpec.value.join(', ');
  },
  properties: function (properties, format) {
    return properties.key + ': ' + pickValues(properties.value, format).join(',');
  },
  raw: function (raw) {
    return raw.key + ': ' + raw.value;
  }
};


var stringifySection = function (section) {
  var head = '[' + section.section + ']';
  var format = null;

  var body = section.body.map(function (descriptor) {
    var method = (descriptor.type == 'comment') ? 'comment'
               : (descriptor.key == 'Format') ? 'formatSpec'
               : format ? 'properties'
               : 'raw';

    if (method == 'formatSpec') {
      format = descriptor.value;
    }

    return stringifyDescriptor[method](descriptor, format);
  }).join('\n');

  return body ? head + '\n' + body : head;
};


var stringifyAss = function (ass) {
  return ass.map(stringifySection).join('\n\n') + '\n';
};


module.exports = stringifyAss;
