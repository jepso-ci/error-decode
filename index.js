module.exports = decode;

function decode(obj) {
  if (obj instanceof Error) {
    return decodeError(obj);
  } else if (typeof obj === 'object') {
    var str = Object.prototype.toString.call(obj);
    if (str === '[object Array]' || str === '[object Arguments]') {
      return decodeArray(obj);
    } else {
      return decodeObject(obj);
    }
  } else {
    return obj;
  }
}

function decodeArray(arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    res.push(decode(arr[i]));
  }
  return res;
}
function decodeObject(obj) {
  var res = {};
  for (var key in obj) {
    res[key] = decode(obj[key]);
  }
  return res;
} 

function decodeError(err) {
  var cons = '$ERROR_CONSTRUCTOR$';
  var out;
  switch (err[cons]) {
    case 'EvalError':
      out = new EvalError(err.message, err.fileName, err.lineNumber);
      break;
    case 'RangeError':
      out = new RangeError(err.message, err.fileName, err.lineNumber);
      break;
    case 'ReferenceError':
      out = new ReferenceError(err.message, err.fileName, err.lineNumber);
      break;
    case 'SyntaxError':
      out = new SyntaxError(err.message, err.fileName, err.lineNumber);
      break;
    case 'TypeError':
      out = new TypeError(err.message, err.fileName, err.lineNumber);
      break;
    case 'URIError':
      out = new URIError(err.message, err.fileName, err.lineNumber);
      break;
    case 'Error':
      out = new Error(err.message, err.fileName, err.lineNumber);
      break;
  }

  out.message = err.message;
  out.name = err.name;

  if (typeof err.stack === 'string') out.stack = err.stack;
  if (typeof err.fileName === 'string') out.fileName = err.fileName;
  if (typeof err.lineNumber === 'string' || typeof err.stack === 'string') out.lineNumber = err.lineNumber;
  
  return out;
}