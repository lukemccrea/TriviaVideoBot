'use strict';

function pickValues(obj, keys){
  if(!Array.isArray(keys)){
    keys = [keys];
  }

  return keys.map(function(key){
    return obj[key];
  });
}

module.exports = pickValues;
