const log = console.log;
const assert = require("assert");
const control  = require("../control.js");


describe("#printf test", () => {

    let failFormater;
    let successFormater;
    let realFormat;
    beforeEach(() => {
        
        failFormater = "%s %d %f %% %z";
        successFormater = "%s %d %f %%";
        realFormat = successFormater.replace(/%%/g,"");
        
    });

    afterEach(() => {
        
        failFormater = undefined;
        successFormater = undefined;
        realFormat = undefined;
    });

    
    describe("#handle printf argument", () => {
        it("should throw error if replacementString does not equal format sepcifiers", () => {
            expect(() => control.printf(successFormater))
                .toThrowError("replacement strings does not equal fromat specifiers");
        });
        it("should throw error if first argument string is not defined", () => {
            expect(() => control.printf()).toThrowError("undefined is not a valid string");
        });
        it("should throw error if first argument is not of type string", () => {
            //assert.throws(control.printf({}));
            expect(() => control.printf({})).toThrowError("[object Object] is not a valid string");
        });
        
        it("should succeed if first argument is a string with valid format specifier", () => {
            expect(control.printf(successFormater,"string", 12, 12.5)).toEqual(true);
        });
    });

    describe("#handle valid formaters", () => {
        it("should fail when ever an invalid formater is specified", () => {
            expect(() => control.printf(failFormater)).toThrowError("%z is not a valid format");
        });
        it("should succeed whenever a valid format is specified", () => {
            expect(control.printf(successFormater, "string", 12, 12.5)).toEqual(true);
        });
    });

    describe("other small test", () => {
        it("should handle invalid types" , () => {
            expect(() => control.printf(successFormater,"string","string",12.5)).toThrowError("type mismatch at string");
        });

        it("should return true if %% is not in format", () => {
            expect(control.printf(realFormat,"string",12,12.5)).toEqual(true);
        });
    });

    describe("#test for valid formaters", () => {
        describe("test for json formater", () => {
            it("should return true for valid json data", () => {
                expect(control.printf("%jo", JSON.stringify({}))).toEqual(true);
            });
            it("should throw error for non json types", () => {
                expect(() => control.printf("%jo", {})).toThrowError("type mismatch at [object Object]");
            });
            it("should throw error for invalid json", () => {
                expect(() => control.printf("%jo", "a")).toThrowError("SyntaxError: Unexpected token a in JSON at position 0");
            });
            
        });

        describe("test for charcter formater", () => {
            it("should return true for valid character", () => {
                expect(control.printf("%c", "victory")).toEqual(true);
            });
            it("should throw error for invalid replacement for character", () => {
                expect(() => control.printf("%c", 12)).toThrowError("type mismatch at 12");
            });
        });
        describe("test for array formater", () => {
            it("should return true for valid array", () => {
                expect(control.printf("%ar", [1,2,3,4])).toBeTruthy();
            });
            it("should throw error for invalid array", () => {
                expect(() => control.printf("%ar", "1234")).toThrowError(`type mismatch at 1234`);
            });
        });
        describe("test for object formater", () => {
            it("should return true for valid objects", () => {
                expect(control.printf("%ob", {})).toBeTruthy();
            });
            it("should throw an error for invalid objects", () => {
                expect(() => control.printf("%ob", [])).toThrowError(`expected  to be an object but got an array`);
            });
            it("should throw an error for invalid objects that are not arrays", () => {
                expect(() => control.printf("%ob", "s")).toThrowError(`type mismatch at s`);
            });
        });
        describe("test for exponent", () => {
            it("should return true for valid numbers", () => {
                expect(control.printf("%e",0xad)).toBeTruthy();
            });
            it("should throw an error for invalid numbers", () => {
                expect(() => control.printf("%e", "hi25")).toThrowError(`invalid replacement string for %e`);
            });
        });
        describe("test for octal numbers", () => {
            it("should return true for valid numbers", () => {
                expect(control.printf("%o",0xad)).toBeTruthy();
            });
            it("should throw an error for invalid numbers", () => {
                expect(() => control.printf("%o", "hi25")).toThrowError(`type mismatch at hi25`);
            });
        });
        
        
    });

    describe("#handle modifiers", () => {
        it("should return true for space modifier", () => {
            expect(control.printf("%12s","hello")).toBeTruthy();
        });
        it("should return return true for string triming", () => {
            expect(control.printf("%12.3s", "hello")).toBeTruthy();
        });
        it("should throw an error if dot is more than one", () => {
            expect(() => control.printf("%12..5s", "hello")).toThrowError(`invalid modifer in %12..5s`);
        });
        it("should throw an error if modifier contains a character", () => {
            expect(() => control.printf("%12a..5s", "hello")).toThrowError(`invalid character in modifiers %12a..5s`);
        });
        it("should be truthy when modifier is less than replacementString length", () => {
            expect(control.printf("%4.2s","hello")).toBeTruthy();
        });
    });
});


