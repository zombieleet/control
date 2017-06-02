const { format:_fft } = require("util")

class Control {
    constructor() {
        this.format = ["ob","ar","jn","bi","s","d","f","o","e","E","g","G","u","c","x","X"]
        this.string = undefined // uh
    }
    static _initControl() {
        return new Control()
    }
    static isString(str) {
        return str  && typeof(str) === "string"
    }
    static validate(_format,_this) {
        
        let validFormat = []

        let regexp = new RegExp(`(${_this.format.join("|")})$`)

        for ( let _isValid of _format ) {

            if ( regexp.test(_isValid) || _isValid === "%%" ) {
                validFormat.push(_isValid)
                continue
            }
            return { status: false, valid: _isValid}
        }

        return { status: true , valid: validFormat}
    }
    static Throws(replacementString,format,type) {

        if ( typeof(replacementString) !== type ) {
            throw new Error(`type mismatch at ${replacementString}`)
        }

        return true
    }
    static shiftFormaters(_this,cb = new Function()) {

        let { replacements, valid } = _this.arguments
        cb(replacements.shift(),valid.shift())
    }

    static checkModifierExistence(modifiers,_this) {

        let { format, replacementString } = modifiers,
            _regexp = new RegExp(`^%(.*)(${_this.format.join("|")})`),
            _modifiers = format.replace(_regexp,"$1")
        if ( _modifiers === "" ) return false
        return { _regexp, _modifiers }
    }
    static checkLength(replace,valid) {

        if ( (replace.length === valid.length) && ! valid.includes("%%") ) {
            return true
        }

        let _valid = valid.filter( x => x !== "%%" )
        let _replace = replace.filter(x => x !== "%%")

        return (_replace.length === _valid.length)

    }    
    static makeNumber(value,rplstr) {

        //return isNaN(Number(value)) ? Number(isNaN(rplstr.length) ? 0 : rplstr.length ) : Number(value);

        if ( isNaN(Number(value)) && ! rplstr.length ) {
            return 0
        } else if ( isNaN(Number(value)) && rplstr.length ) {
            return rplstr.length

        } else {
            return Number(value)
        }

    }
    static formatWithoutModifiers(format,replacementString) {
        switch(format) {
        case "%e":
            return Control.toExponent(replacementString)
        case "%E":
            return Control.toExponent(replacementString).toUpperCase()
        case "%c":
            return replacementString[0]
        case "%ob":
            return _fft(replacementString)
        case "%ar":
            return _fft(replacementString)
        case "%bi":
            return Control.toBinary(replacementString)
        case "%x":
            return Control.toHex(replacementString)
        case "%u":
            return Control.toUint(replacementString)
        default:
            return replacementString
        }
    }
    static handleFormaters(formaters,_this) {

        // arrays are passed by reference in javascript
        // because they are object
        // Array.of creates a new array off from formaters

        const _formaters = Array.of(...formaters)

        for ( let i = 0 ; i < _formaters.length; i++ ) {

            let method = _formaters[i].match(/([a-zA-Z])+$/)
            

            if ( method ) {

                try {
                    _this[`__${method[0].toUpperCase()}`]()
                    continue 
                } catch(ex) {
                    throw ex
                }
            }
            _this.__Escape()
        }
    }
    
    static getModifiers(modifiers,_this) {

        let {  format, replacementString } = modifiers,

            val = Control.checkModifierExistence(modifiers,_this)

        if ( ! val ) {
            return Control.formatWithoutModifiers(format,replacementString)
        }
        
        let regexp = /^(\d+)(\.+)(\d+)$|^(\d+)(\.+)(-\d+)$|^(\d+)(\.+)$|^(\d+)$|^(\.+)(\d+)$|^(\.+)(-\d+)$|^(\.+)$/,
            { _regexp,_modifiers } = val

        if ( ! /^[0-9-\.]+$/.test(_modifiers) ) {
            throw new Error(`invalid character in modifiers ${format}`)
        }
        
        let _matched = _modifiers.match(regexp)

        if ( ! _matched ) {
            throw new Error("unknown error while matching fieldwithds")
        }


        _matched = _matched[0]

        if ( /(\.{2,})/.test(_matched) ) {
            throw new Error(`invalid modifier in ${format}`)
        }
        
        let [ spaceAmount, toPrint ] = _matched.split(".")

        let dot = "."
        
        spaceAmount = Control.makeNumber(spaceAmount,replacementString)
        toPrint = Control.makeNumber(toPrint,replacementString)
        
        
        if ( spaceAmount >= 0 && toPrint >= 0 ) {
            let space = Control.computeSpace(spaceAmount,replacementString),
                afterDot = Control.ComputerAfterDot({format,toPrint,replacementString,_this})

            return `${space}${afterDot}`
        } else if ( toPrint < 0 && /o$/.test(format) ) {
            
            let space = Control.computeSpace(spaceAmount,replacementString),
                afterDot = Control.ComputerAfterDot({format,toPrint,replacementString,_this})
            return `${space}${afterDot}`
            
        } else {
            return format.replace(/(-)/,"0$1")
        }
    }




    static ComputerAfterDot({format,toPrint,replacementString,_this}) {

        let value = format.match(/[a-zA-Z]+$/)

        switch(value[0]) {
        case "s":
            return Control.computeStringTriming(toPrint,replacementString)
        case "d":
            return Control.computeDecimalPlace(toPrint,replacementString)
        case "f":
            return Control.computeNumberPrecision(toPrint,replacementString)
        case "o":
            return Control.computeDecimalPlace(toPrint,replacementString)
        case "ob":
            return Control.computeDataToPrint(toPrint,replacementString)
        case "ar":
            return Control.computeDataToPrint(toPrint,replacementString)
        case "e":
            return Control.toExponent(replacementString,toPrint)
        case "E":
            // to convert e to capital letter E
            return Control.toExponent(replacementString,toPrint).toUpperCase()
        case "g":
            break
        case "G":
            break
        case "u":
            return Control.computeDecimalPlace(toPrint, Control.toUint(replacementString))
        case "c":
            return Control.computeStringTriming(toPrint,replacementString)
        case "jn":
            return JSON.stringify(Control.computeDataToPrint(toPrint,replacementString))
        case "bi":
            return Control.toBinary(replacementString)
        case "x":
            return Control.toHex(replacementString)
        case "X":
            return Control.toHex(replacementString).toUpperCase()
        default:
            throw new Error("This error should never happen")
        }
    }
    static computeSpace(num = 0,rlstr) {

        let space = ""

        while ( num-- > 0 ) {
            space += " "
        }

        
        return space

        //return " ".repeat(num);
        
    }
    static toHex(rlstr) {
        // return rlstr.toString(16)
        let remainder = [],quotient = rlstr
        
        do {
            
            let _remainder = quotient % 16
            
            quotient = Math.trunc(quotient / 16)
            
            
            if ( _remainder < 10 ) {
                remainder.unshift(_remainder)
                continue
            }
            
            remainder.unshift(_remainder.toString(16))
            
        } while (quotient > 0 )
        
        return remainder.join("")
    }
    static toUint(rlstr) {
        
        // 32bit;
        // return new Uint32Array([rlstr])[0];
        return rlstr >>> 0

        
    }
    static *convertStringToInt(rlstr) {
        
        for ( let i = 0; i < rlstr.length ; i++ ) {
            let codePoint = rlstr[i].charCodeAt()
            yield codePoint
        }
        
    }
    static *__DataToPrint(num) {
        while ( num-- > 0 ) {
            yield num
        }
    }

    static toOctal(operand) {
        // return rlstr.toString(8)
        let octalvalue = []
        let remainder
        

        do {
            remainder = operand % 8
            octalvalue.unshift(remainder)
        } while ((operand = Math.trunc(operand/8)) !== 0 )

        return Number(octalvalue.join(""))
    }
    static toBinary(rlstr) {
        // return rlstr.toString(2)
        let binary = [], quotient
        
        while ( rlstr > 0 ) {
            binary.unshift(rlstr % 2)
            quotient = Math.trunc(rlstr / 2)
            rlstr = quotient
        }
        
        binary.unshift(rlstr % 2)

        // for some reason the leading 0 which is a result of rlstr % 2is truncated when coereced to a number
        
        //console.log(binary.join(""),parseInt(binary.join("")),Number(binary.join(""));

        return binary.join("")
        
    }
    static toExponent(operand,to = 4) {
        return operand.toExponential(to)
    }
    
    
    static computeDecimalPlace(num = 0, rlstr) {

        let _rlstr = String(rlstr)

        let value = ""

        while ( num-- > _rlstr.length ) {
            value = "0" + value
        }

        return `${value}${rlstr}`
        
    }
    static computeNumberPrecision(num = 0, rlstr) {
        
        
        if ( num === 0 ) return parseInt(rlstr)
        
        // www.jacklmoore.com/notes/rounding-in-javascript/
        return Number(Math.round(rlstr+"e"+num)+"e-"+num)
        
    }

    static computeDataToPrint(num = 0,rlstr) {

        if ( num === 0 ) return _fft(rlstr)
        
        
        let retValue 
        
        if ( Array.isArray(rlstr) ) {

            retValue = []

            let i = 0

            for ( let _n of Control.__DataToPrint(num) )
                retValue.push(rlstr[i++])

            return retValue
        }

        retValue = {}
        
        let prop , i = 0
        
        if ( typeof(rlstr) === "string" ) {
            rlstr = JSON.parse(rlstr)
        }
        prop = Object.keys(rlstr)

        for ( let _n of Control.__DataToPrint(num) ) {

            if ( ! prop[i] ) break
            Object.assign(retValue, {
                [prop[i]]: rlstr[prop[i]]
            })
            i++
        }

        return _fft(retValue)


    }
    
    static computeStringTriming(num = 0,rlstr) {
        return rlstr.slice(0,num)
    }

    ReplaceFindings(format,replacementString) {
        
        const { arguments: { string } } = this
        
        replacementString = Control.getModifiers({string,format,replacementString},this)

        this.arguments.string = string.replace(format,replacementString)

        return true        
    }
    printf(string, ...replacements) {

        if ( ! Control.isString(string) )
            throw new Error(`${string} is not a valid string`)

        
        let _joined = this.format.join("|")
        //let _rgpx = new RegExp(`((%%)|(%)(${_joined})|(%)(.*)(${_joined}))`,"g");
        let _rgpx = new RegExp(`((%%)|(%)(${_joined})|(%)(\\d+)(${_joined})|(%)(\\d+)(\\.)(${_joined})|(%)(\\d+)(\\.)(-\\d+)(${_joined})|(%)(\\d+)(\\.)(\\d+)(${_joined})|(%)(\\.)(${_joined})|(%)(\\.)(-\\d+)(${_joined})|(%)(\\.)(\\d+)(${_joined})|(%)(.*)([a-zA-Z]+))`,"g")
        
        let formaters = string.split(/[^a-zA-Z\.%-\d+]+/)

        let _formaters = []

        formaters.forEach(x => {
            const _matched = x.match(_rgpx)

            if ( _matched && _matched.length < 2 ) {
                return _formaters.push(_matched[0])
            } 

            if ( _matched && _matched.length > 1 ) {
                for ( let val of _matched ) {
                    _formaters.push(val)
                }
            }
        })
        
        formaters = _formaters
        _formaters = undefined

        let { status, valid } = Control.validate(formaters,this)

        if ( ! status )
            throw new Error(`${valid} is not a valid format`)


        if ( ! Control.checkLength(replacements,valid) )
            throw new Error("replacement strings does not equal fromat specifiers")

        this.arguments = {
            string,
            replacements,
            valid
        }

        Control.handleFormaters(valid,this)

        console.log(this.arguments.string)
        
        
        return this.arguments.string
    }

    __Escape() {

        Control.shiftFormaters(this, (replacementString,format) => {

            // escape % if %% was passed, we don't need replacement string here

            // send the replacementString back to the replacemnets array
            //   this is done just to balance the replacements and the valid formaters


            const { string , replacements } = this.arguments

            replacements.unshift(replacementString)

            this.arguments.string = string.replace(format,"%")
            return true
        })

    }
    __U() {
        // learn how to make numbers unsgined integers in javascript
        Control.shiftFormaters(this,(replacementString,format) => {
            Control.Throws(replacementString,format,"number")

            return this.ReplaceFindings(format,replacementString)
        })
    }
    __E() {
        // learn how to work with expontents in javascript
        Control.shiftFormaters(this, (replacementString,format) => {
            if ( isNaN(Number(replacementString)) ) {
                throw new Error(`invalid replacement string for ${format}`)
            }

            return this.ReplaceFindings(format,replacementString)
        })
    }
    __O() {
        // learn how to work with octal numbers in javascript
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"number")

            replacementString = Control.toOctal(replacementString)

            return this.ReplaceFindings(format,replacementString)
        })
    }
    __BI() {
        // learn how to work with binary numbers
        Control.shiftFormaters(this, (replacementString,format) => {
            
            try {
                
                Control.Throws(replacementString,format,"number")
                return this.ReplaceFindings(format,replacementString)
                
            } catch(ex) {
                
                Control.Throws(replacementString,format,"string")
                
                let gen = Control.convertStringToInt(replacementString),
                    { value , done } = gen.next(),
                    binary = []

                while ( ! done ) {
                    
                    binary.push(Control.toBinary(value));
                    
                    ({value,done} = gen.next())
                }
                
                let { arguments: { string } } = this
                
                this.arguments.string = string.replace(format,binary.join(""))
                
                return true
            }
            
        })
    }
    __JN() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"string")

            try {

                JSON.parse(replacementString)

            } catch(err) {

                throw new Error(err)

            }
            
            return this.ReplaceFindings(format,replacementString)
        })
    }
    __C() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"string")
            
            return this.ReplaceFindings(format,replacementString)
            
        })
    }
    __AR() {
        Control.shiftFormaters(this, (replacementString,format) => {

            if ( ! Array.isArray(replacementString) ) {
                throw new Error(`type mismatch at ${replacementString}`)
            }
            
            return this.ReplaceFindings(format,replacementString)
            
        })
    }
    __OB() {
        Control.shiftFormaters(this, (replacementString,format) => {

            if ( ! Array.isArray(replacementString) ) {
                Control.Throws(replacementString,format,"object")
            } else {
                throw new Error(`expected ${replacementString} to be an object but got an array`)
            }

            return this.ReplaceFindings(format,replacementString)

        })
    }
    __D() {

        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"number")


            return this.ReplaceFindings(format,replacementString)

        })
    }
    __S() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"string")


            return this.ReplaceFindings(format,replacementString)

        })
    }
    __F() {
        Control.shiftFormaters(this, (replacementString,format) => {

            Control.Throws(replacementString,format,"number")

            return this.ReplaceFindings(format,replacementString)
        })
    }
    __X() {
        Control.shiftFormaters(this,(replacementString,format) => {
            Control.Throws(replacementString,"format","number")
            return this.ReplaceFindings(format,replacementString)
        })
    }
}

const control = Control._initControl()
module.exports = {
    printf: control.printf.bind(control),
    control
}
