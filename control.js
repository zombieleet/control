const { format:_format } = require('util');

class Control {
    constructor() {
        this.format = () => ['s','d','f','o','ob','ar','e','E','g','G','u','c','jo','bi'];
        this.string = undefined; // uh
    }
    static _initControl() {
        return new Control();
    }
    static isString(str) {
        return str  && typeof(str) === 'string';
    }
    static validate(_format,_this) {

        let validFormat = [];

        let regexp = new RegExp(`(${_this.format().join('|')})$`);

        for ( let _isValid of _format ) {

            if ( regexp.test(_isValid) || _isValid === "%%" ) {
                validFormat.push(_isValid);
                continue;
            }
            return { status: false, valid: _isValid};
        }

        return { status: true , valid: validFormat};
    }
    static Throws(replacementString,format,type) {

        if ( typeof(replacementString) !== type ) {
            throw new Error(`type mismatch at ${replacementString}`);
        }

        return true;
    }
    printf(string, ...replacements) {

        if ( ! Control.isString(string) )
            throw new Error(`${string} is not a valid string`);


        const formaters = string.split(' ').map( _getAllFormaters => {
            const _matched = _getAllFormaters.match(/^(%.*)$/);
            if ( _matched ) return _matched[0];
        }).filter( _removeUndefined => _removeUndefined);

        let { status, valid } = Control.validate(formaters,this);

        if ( ! status )
            throw new Error(`${valid} is not a valid format`);


        if ( ! Control.checkLength(replacements,valid) )
            throw new Error(`replacement strings does not equal fromat specifiers`);

        this.arguments = {
            string,
            replacements,
            valid
        };
        
        Control.handleFormaters(valid,this);

        //console.log(this.arguments.string);
        return true;
    }

    static checkLength(replace,valid) {

        if ( (replace.length === valid.length) && ! valid.includes("%%") ) {
            return true;
        }

        let _valid = valid.filter( x => x !== "%%" );
        let _replace = replace.filter(x => x !== "%%");
        //console.log(replace,valid);


        return (_replace.length === _valid.length);

    }
    static handleFormaters(formaters,_this) {

        // arrays are passed by reference in javascript
        // because they are object
        // Array.of creates a new array off from formaters
        
        const _formaters = Array.of(...formaters);

        for ( let i = 0 ; i < _formaters.length; i++ ) {

            let method = _formaters[i].match(/([a-zA-Z])+$/);
            
            if ( method ) {

                try {
                    _this[`__${method[0].toUpperCase()}`]();
                    continue ;
                } catch(ex) {
                    throw ex;
                }
            }
            _this.__Escape();
        }
    }
    
    static toOctal(operand) {

        let octalvalue = [];
        let remainder;


        do {
            remainder = operand % 8;
            octalvalue.unshift(remainder);
        } while ((operand = Math.trunc(operand/8)) !== 0 )
        
        return Number(octalvalue.join(''));
    }
    static toExponent(operand,to = 4) {
        return operand.toExponential(to);
    }
    __Escape() {

        Control.shiftFormaters(this, (replacementString,format) => {

            // escape % if %% was passed, we don't need replacement string here

            // send the replacementString back to the replacemnets array
            //   this is done just to balance the replacements and the valid formaters


            const { string , replacements } = this.arguments;

            replacements.unshift(replacementString);

            this.arguments.string = string.replace(format,"%");
            return true;
        });

    }
    __U() {
        // learn how to make numbers unsgined integers in javascript
    }
    __E() {
        // learn how to work with expontents in javascript
        Control.shiftFormaters(this, (replacementString,format) => {
            if ( isNaN(Number(replacementString)) ) {
                throw new Error(`invalid replacement string for ${format}`);
            }

            replacementString = Control.toExponent(replacementString);
            
            const { arguments: { string } } = this;

            this.arguments.string = string.replace(format,replacementString);
            return true;
        });
    }
    __O() {
        // learn how to work with octal numbers in javascript
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"number");
            
            replacementString = Control.toOctal(replacementString);

            const { string } = this.arguments;

            this.arguments.string = string.replace(format, replacementString);
            return true;
        });
    }
    __BI() {
        // learn how to work with binary numbers
    }
    __JO() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"string");
            
            try {

                JSON.parse(replacementString);

            } catch(err) {

                throw new Error(err);

            }

            const { string } = this.arguments;

            this.arguments.string = string.replace(format, replacementString);

            return true;
        });
    }
    __C() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"string");

            const { string } = this.arguments;

            this.arguments.string = string.replace(format, replacementString[0]);
            return true;
        });
    }
    __AR() {
        Control.shiftFormaters(this, (replacementString,format) => {

            if ( ! Array.isArray(replacementString) ) {
                throw new Error(`type mismatch at ${replacementString}`);
            }

            const { string } = this.arguments;

            this.arguments.string = string.replace(format,replacementString);
            return true;
        });
    }
    __OB() {
        Control.shiftFormaters(this, (replacementString,format) => {

            if ( ! Array.isArray(replacementString) ) {
                Control.Throws(replacementString,format,"object");
            } else {
                throw new Error(`expected ${replacementString} to be an object but got an array`);
            }

            const { string } = this.arguments;

            this.arguments.string = string.replace(format,_format(replacementString));
            return true;

        });
    }
    __D() {

        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"number");


            // non global, don't think too much o.O
            const { string } = this.arguments;

            this.arguments.string = string.replace(format,parseInt(replacementString));
            return true;

        });
    }
    __S() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"string");


            // non global, don't think too much o.O


            const { string } = this.arguments;

            Control.getModifiers({string,format,replacementString},this);

            this.arguments.string = string.replace(format,replacementString);

            return true;

        });
    }
    __F() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"number");

            const { string } = this.arguments;


            this.arguments.string = string.replace(format,parseFloat(replacementString));

            return true;
        });
    }
    static shiftFormaters(_this,cb = new Function()) {

        let { replacements, valid } = _this.arguments;
        cb(replacements.shift(),valid.shift());
    }

    static checkModifierExistence(modifiers,_this) {

        let { format, replacementString } = modifiers,
            _regexp = new RegExp(`^%(.*)(${_this.format().join('|')})$`),
            _modifiers = format.replace(_regexp,"$1");
        
        if ( _modifiers === '' ) return false;
        
        return { _regexp, _modifiers };
    }
    static makeNumber(value,rplstr) {
        // rplstr.length the length of the replacement string
        return isNaN(Number(value)) ? Number(rplstr.length) : Number(value);
    }
    static getModifiers(modifiers,_this) {
        
        let {  format, replacementString } = modifiers,
            
            val = Control.checkModifierExistence(modifiers,_this);

        if ( ! val ) return false;
        
        
        let regexp = /^(\d+)(\.+)(\d+)$|^(\d+)(\.+)$|^(\d+)$|^(\.+)(\d+)$|^(\.+)$/,
            { _regexp,_modifiers } = val;
        
        
        if ( ! /^[0-9\.]+$/.test(_modifiers) ) {

            throw new Error(`invalid character in modifiers ${format}`);
        }
        

        let _matched = _modifiers.match(regexp),
            
            [ , f_d1, f_dot, f_d2, s_d1, s_dot, th_d1, fo_dot, fo_d2, fif_dot, , ] = _matched,
            
            spaceAmount = f_d1 || s_d1 || th_d1,
            
            dot = f_dot || s_dot || fo_dot || fif_dot,
            
            toPrint = f_d2 || fo_d2;

        if ( dot && dot.length > 1 ) throw new Error(`invalid modifer in ${format}`);


        // support
        //    num.num
        //    num.
        //    .num
        //    .
        //    num
        
        spaceAmount = Control.makeNumber(spaceAmount,replacementString);
        toPrint = Control.makeNumber(toPrint,replacementString);
        
        // support standalone num , the '.' is uneccsary
        //  avoiding long if else if else if statement
        
        dot = dot ? dot : '.' ; 
        
        if ( spaceAmount >= 0 && dot && toPrint >= 0) {
            
            console.log(Control.computeSpace(spaceAmount,replacementString) + Control.computeStringTriming(toPrint,replacementString));
            return true;
        }

    }

    static computeSpace(num = 0,rlstr) {


        if ( num  <= rlstr.length ) return "";

        let space = "";

        while ( num-- > 0 ) {
            space += " ";
        }

        return space;

        // return " ".repeat(num);

    }

    static computeNumberPrecision() {
    }
    static computeStringTriming(num = 0,rlstr) {
        return rlstr.slice(0,num);
    }
}


module.exports = Control._initControl();

//console.log(Control.toOctal(0666));
