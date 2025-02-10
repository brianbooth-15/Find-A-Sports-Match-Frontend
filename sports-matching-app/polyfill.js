// polyfill.js

// Polyfill for util.promisify
if (typeof util === 'undefined') {
  global.util = require('util');  // Polyfill for `util.promisify`
}

if (typeof util.promisify === 'undefined') {
  global.util.promisify = function(fn) {
    return function(...args) {
      return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };
  };
}

// Polyfill for ReadableStream and fetch
import fetch from 'cross-fetch';
global.fetch = fetch;

// Ensure global.fetch and ReadableStream are set up
global.fetch = require('node-fetch');
import { ReadableStream } from "web-streams-polyfill";
global.ReadableStream = ReadableStream;

// Polyfill for web streams
import 'web-streams-polyfill';
