const control = require('./control');
const printf = control.printf.bind(control);

printf("%.4c %.4s", "javascript", "node.js");
