const control = require('./control');

const printf = control.printf.bind(control);

printf("%3.22d %.55u %.15e %.2f", 12, -1, 23, 24.56735);
