const log = console.log;
const assert = require("assert");
const { printf , control } = require("../control.js");


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
    

    /*it("spies", () => {
        spyOn(control, "printf").and.callFake(() => {
            return {};
        });

        printf("%s",3);
        expect(typeof printf.calls.argsFor(0)[1]).toEqual('string');
     });*/

    
    describe("#make sure that all formaters was called", () => {
        beforeEach(() => {

            spyOn(control, "__SF");
            spyOn(control, "__JN");
            spyOn(control, "__D");
            spyOn(control, "__C");
            spyOn(control, "__E");
            spyOn(control, "__F");
            spyOn(control, "__O");
            spyOn(control, "__BI");
            spyOn(control, "__AR");
            spyOn(control, "__OB");
            spyOn(control, "__U");
            spyOn(control, "__X");
            printf(`all this formaters method must be called %s %jn %d %c %e %f %o %bi %ar %ob %u %x`, "string", JSON.stringify({json:'json'}),23,"character",2.2,23.5,0x5ad,"binary", ["array"], {object:'object'}, -1, 22);        
            
        });
        
        it("should pass if __S function was called", () => {
            expect(control.__S).toHaveBeenCalled();
        });
        it("should pass if __JN function was called", () => {
            expect(control.__JN).toHaveBeenCalled();
        });
        it("should pass if __D function was called", () => {
            expect(control.__D).toHaveBeenCalled();
        });
        it("should pass if __C function was called", () => {
            expect(control.__C).toHaveBeenCalled();
        });
        it("should pass if __E function was called", () => {
            expect(control.__E).toHaveBeenCalled();
        });
        it("should pass if __F function was calle", () => {
            expect(control.__F).toHaveBeenCalled();
        });
        it("should pass if __O function was called", () => {
            expect(control.__O).toHaveBeenCalled();
        });
        it("should pass if __BI function was called", () => {
            expect(control.__BI).toHaveBeenCalled();
        });
        it("should pass if __AR function was called", () => {
            expect(control.__AR).toHaveBeenCalled();
        });
        it("should pass if __OB function was called", () => {
            expect(control.__OB).toHaveBeenCalled();
        });
        it("should pass if __U function was called", () => {
            expect(control.__U).toHaveBeenCalled();
        });        
        it("should pass if __X function was called", () => {
            expect(control.__X).toHaveBeenCalled();
        });        

    });
    describe("#handle printf argument", () => {
        it("should throw error if replacementString does not equal format sepcifiers", () => {
            expect(() => printf(successFormater))
                .toThrowError("replacement strings does not equal fromat specifiers");
        });
        it("should throw error if first argument string is not defined", () => {
            expect(() => printf()).toThrowError("undefined is not a valid string");
        });
        it("should throw error if first argument is not of type string", () => {
            //assert.throws(printf({}));
            expect(() => printf({})).toThrowError("[object Object] is not a valid string");
        });

        it("should succeed if first argument is a string with valid format specifier", () => {
            expect(printf(successFormater,"string", 12, 12.5)).toEqual("string 12 12.5 %");
        });
        it("should work for formaters that are joined together", () => {
            expect(printf("vic%sor%s","t","y")).toEqual(`victory`);
        });
    });

    describe("#handle valid formaters", () => {
        it("should fail when ever an invalid formater is specified", () => {
            expect(() => printf(failFormater)).toThrowError("%z is not a valid format");
        });
        it("should succeed whenever a valid format is specified", () => {
            expect(printf(successFormater, "string", 12, 12.5)).toEqual("string 12 12.5 %");
        });
    });

    describe("other small test", () => {
        it("should handle invalid types" , () => {
            expect(() => printf(successFormater,"string","string",12.5)).toThrowError("type mismatch at string");
        });

        it("should return true if %% is not in format", () => {
            expect(printf(realFormat,"string",12,12.5)).toEqual("string 12 12.5 ");
        });
    });

    describe("#test for valid formaters", () => {
        describe("test for json formater", () => {
            it("should return true for valid json data", () => {
                expect(printf("%jn", JSON.stringify({}))).toEqual("{}");
            });
            it("should throw error for non json types", () => {
                expect(() => printf("%jn", {})).toThrowError("type mismatch at [object Object]");
            });
            it("should throw error for invalid json", () => {
                expect(() => printf("%jn", "a")).toThrowError("SyntaxError: Unexpected token a in JSON at position 0");
            });

        });

        describe("test for charcter formater", () => {
            it("should return true for valid character", () => {
                expect(printf("%c", "victory")).toEqual("v");
            });
            it("should throw error for invalid replacement for character", () => {
                expect(() => printf("%c", 12)).toThrowError("type mismatch at 12");
            });
        });
        describe("test for array formater", () => {
            it("should return true for valid array", () => {
                expect(printf("%ar", [1,2,3,4])).toBeTruthy();
            });
            it("should throw error for invalid array", () => {
                expect(() => printf("%ar", "1234")).toThrowError(`type mismatch at 1234`);
            });
        });
        describe("test for object formater", () => {
            it("should return true for valid objects", () => {
                expect(printf("%ob", {})).toBeTruthy();
            });
            it("should throw an error for invalid objects", () => {
                expect(() => printf("%ob", [])).toThrowError(`expected  to be an object but got an array`);
            });
            it("should throw an error for invalid objects that are not arrays", () => {
                expect(() => printf("%ob", "s")).toThrowError(`type mismatch at s`);
            });
        });
        describe("test for exponent", () => {
            it("should return true for valid numbers", () => {
                expect(printf("%e",0xad)).toBeTruthy();
            });
            it("should throw an error for invalid numbers", () => {
                expect(() => printf("%e", "hi25")).toThrowError(`invalid replacement string for %e`);
            });
        });
        describe("test for octal numbers", () => {
            it("should return true for valid numbers", () => {
                expect(printf("%o",0xad)).toBeTruthy();
            });
            it("should throw an error for invalid numbers", () => {
                expect(() => printf("%o", "hi25")).toThrowError(`type mismatch at hi25`);
            });
        });

        describe("test for unsgined integers", () => {
            it("should print unsigined integers", () => {
                expect(printf("%u", -1)).toEqual(`4294967295`);
            });
        });

        describe("test for hexadecimal numbers ", () => {
            it("should print hexadecimal numbers", () => {
                expect(printf("%x",22)).toEqual(`16`);
            });
        });

    });

    describe("#handle modifiers", () => {
        it("should return true for space modifier", () => {
            expect(printf("%12s","hello")).toBeTruthy();
        });
        it("should return return true for string triming", () => {
            expect(printf("%12.3s", "hello")).toBeTruthy();
        });
        it("should throw an error if dot is more than one", () => {
            expect(() => printf("%12..5s", "hello")).toThrowError(`invalid modifier in %12..5s`);
        });
        it("should throw an error if modifier contains a character", () => {
            expect(() => printf("%12a..5s", "hello")).toThrowError(`invalid character in modifiers %12a..5s`);
        });
        it("should be truthy when modifier is less than replacementString length", () => {
            expect(printf("%4.2s","hello")).toBeTruthy();
        });
        it("should work if spaceAmount is not specifed", () => {
            expect(printf("%.3d", 21)).toBeTruthy();
        });
        it("should print expontential numbers with a capital letter E", () => {
            expect(printf("%E", 2.2)).toBeTruthy();
        });
        it("should be truthy when coverting string to binary numbers", () => {
            expect(printf("%bi", "victory")).toBeTruthy();
        });
        it("should be truthy when coverting decimal numbers to binary numbers", () => {
            expect(printf("%bi", 21)).toBeTruthy();
        });
        it("should be truthy when computing number precision", () => {
            expect(printf("%.4f", 21.55678)).toBeTruthy();
        });
        it("should be truthy when computing decimal places for o" , () => {
            expect(printf("%.3o", 21)).toBeTruthy();
        });
        it("should be truthy when computing for the amount of data to print in a javascript object", () => {
            expect(printf("%.3ob", {js:"javascript", py:"python", rb:"ruby", pl:"perl", sh: "bash"})).toBeTruthy();
        });
        it("should be truthy when computing for amount of data to print in JSON", () => {
            expect(printf("%.2jn", JSON.stringify({a:"a", b:"b", c:"c", d:"d", f:"f"}))).toBeTruthy();
        });
        it("should be truthy when computing for amount of data to print in an array", () => {
            expect(printf("%.2ar", ["a","b","c","d"])).toBeTruthy();
        });
        it("should be truthy when computing for exponential values with a small letter E", () => {
            expect(printf("%.3e", 2.2)).toBeTruthy();
        });
        it("should be truthy when computing for exponential values with a capital letter E", () => {
            expect(printf("%.3E", 2.2)).toBeTruthy();
        });
        it("should be truthy when calculating the number of characters to print", () => {
            expect(printf("%.3c","victory")).toBeTruthy();
        });
        it("should be truthy when coverting string to binary numbers", () => {
            expect(printf("%.3bi", "victory")).toBeTruthy();
        });
        it("should be truthy when the octal formaters has a negative modifier", () => {
            expect(printf("%.-3o", 32)).toBeTruthy();
        });
        it("should be truthy when any other modifier has a negative formater", () => {
            expect(printf("%1.-3s", "hi")).toBeTruthy();
        });
    });
});
