/*
    * Typescript implementation of the shuffle() mechanic in Lottery.sol. 
    * License: MIT
*/
import { getRangesToString, getNewRandomNumber, getRangesBoundedValuesCount } from "./Shuffle.utils";

interface IParticipant {
    //address participant;
    tokenId: number;
}

interface IRange {
    min: number;
    max: number;
}

class ShuffleParameters {
    random: number;
    rpCount: number;            // Solidity: remainingParticipantsCount
    rpRanges: Array<IRange>;    // Solidity: remainingParticipantsRanges
    
    constructor(_random:number,
                _rpCount: number,
                _rpRanges:Array<IRange>,
                ) {
        this.random = _random;
        this.rpCount = _rpCount;
        this.rpRanges = _rpRanges;
    }
}

let totalWinners:number;

// Participants
let participants: IParticipant[] = [];
let winners: IParticipant[];
let shuffleParameters: ShuffleParameters = new ShuffleParameters(0, 0, []);

// Log
resetValues();
logn(participants);
logn("Participants count: " + shuffleParameters.rpCount);
logn(getRangesToString(shuffleParameters.rpRanges));

/*
    * Shuffle mechanic implementation
    * Optional parameters can be used to reproduce a specific shuffle behavior during debugging
*/
function shuffle(p: ShuffleParameters) {
    logn("\nHalving..." + " RND=" + p.random 
                        + " " + getRangesToString(p.rpRanges)
                        + " rpCount=" + p.rpCount);
    
    p.rpCount = Math.floor(p.rpCount / 2);
    if(p.rpCount < totalWinners) {
        logn("Can't halve anymore");
        // Can not halve anymore. In this case, the ranges are only shuffled.
        // The result is that 1st, 2nd, 3rd place are shuffled.
        p.rpCount = totalWinners;
    }

    if(p.rpRanges.length == 1) {

        //let nextIndex = 26;
        let nextIndex = p.random % (p.rpRanges[0].max - p.rpRanges[0].min + 1) + p.rpRanges[0].min;

        logn("Case 1. nextIndex=" + nextIndex);

        if(nextIndex + p.rpCount - 1 <= p.rpRanges[0].max) {
            logn("Case 1.a");
            p.rpRanges = [{
                min: nextIndex, 
                max: nextIndex + p.rpCount - 1
            }];
        }
        else {
            logn("Case 1.b");
            p.rpRanges = [{
                min: nextIndex,
                max: p.rpRanges[0].max
            },
            {
                min: p.rpRanges[0].min,
                max: p.rpRanges[0].min + (p.rpCount - 1) - (p.rpRanges[0].max - nextIndex + 1)
            }];
        }
    } else {
        //const firstRangeIndex = 1;
        //let nextIndex = 0;

        const firstRangeIndex = p.random % 2;
        let nextIndex = p.random % (p.rpRanges[firstRangeIndex].max - p.rpRanges[firstRangeIndex].min + 1) + p.rpRanges[firstRangeIndex].min;

        logn("Case 2. nextIndex=" + nextIndex);
        
        if(nextIndex + p.rpCount - 1 <= p.rpRanges[firstRangeIndex].max) {
            logn("Case 2.a");
            p.rpRanges = [{
                min: nextIndex, 
                max: nextIndex + p.rpCount - 1
            }];
        }
        else {
            logn("Case 2.b");
            //logn(getValidRangesStr());
            //logn(getValidRangesTotal());
            //logn("nextIndex: " + nextIndex);
        
            // If first is 0 will be 1 and vice-versa
            const secondRangeIndex = (firstRangeIndex + 1) % 2;

            let participantsInFirstRange = p.rpRanges[firstRangeIndex].max - nextIndex + 1;
            let participantsInSecondRange = p.rpCount - participantsInFirstRange;
            let secondRangeMaxIndex = p.rpRanges[secondRangeIndex].min + participantsInSecondRange - 1;
            if(secondRangeMaxIndex >= participants.length) {
                let surplus = secondRangeMaxIndex + 1 - participants.length;
                nextIndex -= surplus;
                //participantsInFirstRange += surplus;
                //participantsInSecondRange -= surplus;
            }

            //logn("participantsInFirstRange: " + participantsInFirstRange);
            //logn("participantsInSecondRange: " + participantsInSecondRange);
            p.rpRanges = [
                {
                    min: nextIndex, 
                    max: p.rpRanges[firstRangeIndex].max
                },
                {
                    min: p.rpRanges[secondRangeIndex].min, 
                    max: p.rpRanges[secondRangeIndex].min + (p.rpCount - 1) - (p.rpRanges[firstRangeIndex].max - nextIndex + 1)
                }
            ];
        }
    }
}

/*
    * Reset values as if no event ever happened 
*/
function resetValues() {
    totalWinners = 3;

    participants = [];
    for (let i = 0; i <= 5000; i++) {
        participants.push({
            //address: "0x" + index,
            tokenId: i
        });
    }

    shuffleParameters = new ShuffleParameters(0, 
                                              participants.length,
                                              [{
                                                  min: 0,
                                                  max: participants.length - 1
                                              }]);
}

function logn(str: any) {
    console.log(str);
}

function getWinners() {
    let log = "";
    let winnersCount = 0;
    let ranges = shuffleParameters.rpRanges;

    for (let i = 0; i < ranges.length && winnersCount < totalWinners; i++) {
        const range = ranges[i];
        for (let j = range.min; j <= range.max && winnersCount < totalWinners; j++) {
            const participant = participants[j];
            logn(participant);
            logn(j);
            //log += j + "/" + participant["address"] + " ";
            winnersCount++;
        }
    }
    return "Winners: " + log; 
}


// triggerHalving({ 
//     validRanges: [[498,499],[0,59]], 
//     participantsCount: 31, 
//     nextIndex: 45, 
//     random: 4905
// });
// logn(getValidRangesStr());
// logn(getValidRangesTotal());
// logn(getWinners());
// triggerHalving({ 
//     random: 9241
// });
// logn(getValidRangesStr());
// logn(getValidRangesTotal());
// logn(getWinners());

for (let i = 0; i < 10000; i++) {
    resetValues();
    for (let j = 0; j < 1000; j++) {
        shuffle(shuffleParameters);
        logn(getRangesToString(shuffleParameters.rpRanges));
        logn(getRangesBoundedValuesCount(shuffleParameters.rpRanges));
        logn(getWinners());
    }
}

export type {
    IRange
};