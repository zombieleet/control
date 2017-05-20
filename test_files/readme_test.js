const control = require('./control');

const printf = control.printf.bind(control);

printf("%s", "victory");
printf("%c", "victory");
