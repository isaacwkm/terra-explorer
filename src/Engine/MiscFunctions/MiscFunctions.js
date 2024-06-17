// Unrelated to specific game functions.
// Used to aid other functions in small ways or aid in debugging.
class MiscFunctions{

    constructor() {}

    static removeQuotationsFromString(str) {
        let newStr = ""
        for (let i = 1; i < str.length - 1; i++) {
            newStr += str[i];
        }
        return newStr;
    }
    
}