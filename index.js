'use strict';

const fs = require('fs'),
      stream = fs.createReadStream('english-words/words.txt', { encoding: 'utf8' }),
      regexp = /^[abcdefghijlnopqrstuy0-9_ \-\.\u{0132}\u{0133}]+$/u;

let words = [],
    remaining = '',
    maxLength = 0,
    longestWords = [];

stream.on('data', chunk => {
  words = chunk.split('\n');

  // Prepend the remainder of the last chunk to the first word.
  words[0] = remaining + words[0];

  // The last word may be incomplete, so store it to process it in the next iteration.
  remaining = words[words.length - 1];

  if (words.length < 2) {
    // The chunk does not contain a line break, so we just got one, possibly incomplete word.
    // This means we have to wait for more data.
    return;
  }

  for (let i = 0; i < words.length - 1; i++) {
    processWord(words[i]);
  }
});

stream.on('end', () => {
  // Process the last line.
  processWord(remaining);

  // Output longest words, delimited by line breaks.
  console.log(longestWords.join('\n'));
});

function processWord(word) {
  if (word.length > maxLength && regexp.test(word)) {
    maxLength = word.length;
    longestWords = [ word ];
  } else if (word.length === maxLength && regexp.test(word)) {
    longestWords.push(word);
  }
}
