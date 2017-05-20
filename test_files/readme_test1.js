const control = require('./control');

const printf = control.printf.bind(control);

printf("the %s cost %d", "bacon");
