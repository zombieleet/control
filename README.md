# Control 

Control is an implementation of few of C `printf` functionality with extended features


# usage

if you can work with c printf or the shell `printf` functionality, control will be easy


**formaters**

1. %s  "for strings"
2. %d  "for digits"
3. %f  "for floating point numbers"
4. %u "for unicode numbers"
5. %jn "for json data"
6. %ob "for javascript objects"
7. %bi "for binary numbers"
9. %e or %E  "for exponential numbers"
10. %c "for printing single characters" 
11. %x or %X "for hexadecimal numbers"
12. %ar "for arrays"

**how to use formaters**

```javascript
    const control = require('control');
    // using destructuring on printf will make the `this` keyword points to undefined
    const printf = control.printf.bind(control);
    
    printf("my name is %s", "victory");
    printf("the first letter of my name is %c", "victory");

```

**if the number of formters is not equal to the number of replacement strings , an error will be trhwon**

```javascript

    const control = require('./control');
    
    const printf = control.printf.bind(control);
    
    printf("the %s cost %d", "bacon");

```

**working with field widths**

fieldwidths is the number of space a replacement string should forgo

```javascript

    const control = require('control');
    
    const printf = control.printf.bind(control);

    printf("the %34s cost dollars %d", "bacon",100);

```

**precisions, dataToPrint, number of characters to print**

*numbers*

precision works for the flowing formaters

1. %d
2. %e
3. %f
4. %u

```javascript
    const control = require('control');
    
    const printf = control.printf.bind(control);
    
    printf("%3.22d %.55u %.15e %.2f", 12, -1, 23, 24.56735);
    
```

*data to print*

1. %jn
2. %ob
3. %ar

```javascript

    const control = require('./control');

    const printf = control.printf.bind(control);
    
    const obj = {
        firstname:"victory",
        lastname: "osikwemhe",
        country: "nigeria",
        age: 21,
        hobbies: {
            sport: ["soccer","basketball"],
            singing: ["blues"],
            movies: ["action", "war", "horror", "scific"]
        },
        occupation: ["student"]
    };

    printf("%.4jn %.2ob %.3ar", JSON.stringify(obj),obj,["sleepy Hollow","The walking dead", "silicon valley", "vikings", "sense8"]);

```
*number of characters to print*

1. %c
2. %s

```javascript
    
    const control = require('control');
    const printf = control.printf.bind(control);
    
    printf("%.4c %.4s", "javascript", "node.js");
    
```


**NOTE**

if an invalid replacement string is specified for any formater, an error will be throwed

# LICENSE

MIT

GNU ( either version 2 of the License, or at your option any later version.  )
