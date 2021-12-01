import { IRange } from "./Shuffle"

/*
    * Chainlink VRF mock
    * Provides a random number in the inclusive range [0,99]
*/
function getNewRandomNumber() {
    return Math.floor(Math.random() * 100);
}

/*
    * Returns a human readable string of ranges
*/
function rangesToString(ranges: Array<IRange>) {
    let validRangesStr = "Ranges: " + ranges.length + " ["
    let first = true
    ranges.forEach(e => {
        if(first) {
            first = false
        }
        else {
            validRangesStr += ","
        }
        validRangesStr += "[" + e.min + "," + e.max + "]"
    })
    return validRangesStr + "]"
}

/*
    * Returns the number of values that fit in all ranges bounds 
    * For: [[0]], returns 1.
    * For: [[0,2]], returns 3
    * For: [[0,2],[1,54]], returns 57
*/
function getRangesBoundedValuesCount(ranges: Array<IRange>) {
    let total = 0;
    ranges.forEach(range => {
        total += range.max - range.min + 1
    });
    return "BoundedValuesCount: " + total; 
}

/*
    * Logger
*/
function log(str: any) {
    console.log(str);
}

export {
    getNewRandomNumber,
    rangesToString,
    getRangesBoundedValuesCount,
    log
}