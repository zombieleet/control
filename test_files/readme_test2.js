const control = require('./control');

const printf = control.printf.bind(control);

printf("the %33s cost dollars %3.12d", "bacon",100);
