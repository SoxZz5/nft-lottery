/*
    * Typescript implementation of the shuffle() mechanic in Lottery.sol. 
    * Run and see log: yarn test:shuffle > shuffle.log
    * 
    * License: MIT
*/
import { rangesToString, getNewRandomNumber, getRangesBoundedValuesCount, log as l } from "./Shuffle.utils";

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
                _rpRanges:Array<IRange>
                ) {
        this.random = _random;
        this.rpCount = _rpCount;
        this.rpRanges = _rpRanges;
    }

    randomize() {
        this.random = getNewRandomNumber();
    }
}

let totalWinners:number = 0;
let winners: IParticipant[] = [];

// Participants
let participants: IParticipant[] = [];
let shuffleParameters: ShuffleParameters = new ShuffleParameters(0, 0, []);

/*
    * Chainlink VRF mock
*/
function fulfillRandomness() {
    shuffleParameters.randomize();
    return shuffle(shuffleParameters);
}

/*
    * Shuffle mechanic implementation
    * Optional parameters can be used to reproduce a specific shuffle behavior during debugging
*/
function shuffle(p: ShuffleParameters) {
    let remainingParticipantsCount = p.rpCount;
    if(remainingParticipantsCount == totalWinners) {
        // Nothing to do here. The remaining participants
        // count equals the number of expected winners
        return false;
    }

    l("\nHalving..." + " RND=" + p.random 
                        + " " + rangesToString(p.rpRanges)
                        + " rpCount=" + p.rpCount);

    remainingParticipantsCount = Math.floor(remainingParticipantsCount / 2);
    if(remainingParticipantsCount < totalWinners) {
        l("Can't halve anymore");
        // Can not halve anymore, only reducing participants count to totalWinners
        remainingParticipantsCount = totalWinners;
    }
    p.rpCount = remainingParticipantsCount; // Update

    if(p.rpRanges.length == 1) {

        let nextIndex = p.random % (p.rpRanges[0].max - p.rpRanges[0].min + 1) + p.rpRanges[0].min;
        l("Case 1. nextIndex=" + nextIndex + ", remainingParticipantsCount=" + remainingParticipantsCount);

        if(nextIndex + remainingParticipantsCount - 1 <= p.rpRanges[0].max) {
            l("Case 1.a");
            p.rpRanges = [{
                min: nextIndex, 
                max: nextIndex + remainingParticipantsCount - 1
            }];
        }
        else {
            l("Case 1.b");
            p.rpRanges = [{
                min: nextIndex,
                max: p.rpRanges[0].max
            },
            {
                min: p.rpRanges[0].min,
                max: p.rpRanges[0].min + (remainingParticipantsCount - 1) - (p.rpRanges[0].max - nextIndex + 1)
            }];
        }
    } else {
        const firstRangeIndex = p.random % 2;
        let nextIndex = p.random % (p.rpRanges[firstRangeIndex].max - p.rpRanges[firstRangeIndex].min + 1) + p.rpRanges[firstRangeIndex].min;
        l("Case 2. nextIndex=" + nextIndex + ", remainingParticipantsCount=" + remainingParticipantsCount);
        
        if(nextIndex + remainingParticipantsCount - 1 <= p.rpRanges[firstRangeIndex].max) {
            l("Case 2.a");
            p.rpRanges = [{
                min: nextIndex, 
                max: nextIndex + remainingParticipantsCount - 1
            }];
        }
        else {
            l("Case 2.b");
        
            // If first range index is 0, will be 1 and vice-versa (binary inversion)
            const secondRangeIndex = (firstRangeIndex + 1) % 2;

            let participantsInFirstRange = p.rpRanges[firstRangeIndex].max - nextIndex + 1;
            let nextParticipantsInSecondRange = remainingParticipantsCount - participantsInFirstRange;
            let currentParticipantsInSecondRange = p.rpRanges[secondRangeIndex].max - p.rpRanges[secondRangeIndex].min + 1;
            let secondRangeSurplus = nextParticipantsInSecondRange - currentParticipantsInSecondRange;
            
            let newSecondRangeMaxIndex;
            if(secondRangeSurplus > 0) {
                // The number of participants required in the second range is too high
                // Distribute the surplus to the first range and use the entire second range
                nextIndex -= secondRangeSurplus;
                newSecondRangeMaxIndex = p.rpRanges[secondRangeIndex].max;
            } else {
                // The number of participants required fits in the second range (no surplus)
                newSecondRangeMaxIndex = p.rpRanges[secondRangeIndex].min + nextParticipantsInSecondRange - 1;
            }

            p.rpRanges = [
                {
                    min: nextIndex, 
                    max: p.rpRanges[firstRangeIndex].max
                },
                {
                    min: p.rpRanges[secondRangeIndex].min, 
                    max: newSecondRangeMaxIndex
                }
            ];
        }
    }
    return true;
}

/*
    * Reset values as if no event ever happened 
*/
function resetValues(_totalWinners: number,
                    _maxParticipantsCount: number, 
                    _fixedParticipantsCount: boolean) {
    totalWinners = _totalWinners;

    let totalParticipants;
    if(_fixedParticipantsCount) {
        totalParticipants = _maxParticipantsCount;
    } else {
        totalParticipants = Math.floor(Math.random() * _maxParticipantsCount) + 1; // Between the inclusive range [1,_maxParticipantsCount]
    }
    
    if(totalWinners > totalParticipants) {
        // There can not be more winners than participants
        totalWinners = totalParticipants;
    }

    participants = [];
    for (let i = 1; i <= totalParticipants; i++) {
        participants.push({
            //address: "0x" + index,
            tokenId: i - 1
        });
    }

    shuffleParameters = new ShuffleParameters(0, 
                                              participants.length,
                                              [{
                                                  min: 0,
                                                  max: participants.length - 1
                                              }]);
}

/*
    * Sets the winners array by randomly picking winners inside the
    * ranges of remaining participants
*/
function setWinners() {
    winners = [];
    let log = "";
    let winnersCount = 1;
    let p = shuffleParameters;

    let rangeIndex = p.rpRanges.length == 1 ? 0 : p.random % 2;
    let firstWinnerIndex = p.random % (p.rpRanges[rangeIndex].max - p.rpRanges[rangeIndex].min + 1) + p.rpRanges[rangeIndex].min;
    winners.push(participants[firstWinnerIndex]); // 1st winner

    if(totalWinners > 1) {
        // There are more winners to pick

        let nextWinnerIndex = firstWinnerIndex;
        do {
            winnersCount++;
            nextWinnerIndex++;
            if(nextWinnerIndex > p.rpRanges[rangeIndex].max) {
                // End of the current range reached

                if(p.rpRanges.length == 2) {
                    // There are two ranges, do a binary inversion 
                    // on the index to switch to the other range
                    rangeIndex = (rangeIndex + 1) % 2;
                }

                // One range: Restart at the beginning of the current range
                // Two ranges: Continue at the beginning of the other range
                nextWinnerIndex = p.rpRanges[rangeIndex].min;
            }
            winners.push(participants[nextWinnerIndex]); // 2nd, 3rd winners
        }
        while(winnersCount < totalWinners);
    }
    return "Winners: " + log; 
}

/*
    * Returns a human readable string of winners
*/
function winnersToString() {
    setWinners();

    let log = "";
    winners.forEach(winner => {
        log += winner.tokenId + " ";
    });
    return "Winners: " + log; 
}

/*
    * Run events with randomness. Test function for debugging
*/
function runTest() {
    for (let i = 0; i < 1; i++) {
        resetValues(3, 15214, true);

        /* DEBUG */
        // shuffleParameters.random = 7;
        // shuffleParameters.rpCount = 3;
        // //shuffleParameters.rpRanges = [{min:0,max:0}];
        // shuffleParameters.rpRanges = [{min:2,max:2},{min:0,max:1}];
        // if(totalWinners > shuffleParameters.rpCount) {
        //     // There can not be more winners than participants
        //     totalWinners = shuffleParameters.rpCount;
        // }
        /* DEBUG */

        for (let j = 0; j < 100; j++) {
            /* DEBUG */
            //if(shuffle(shuffleParameters)) {
            /* DEBUG */

            if(fulfillRandomness()) {
                l(rangesToString(shuffleParameters.rpRanges));
                l(getRangesBoundedValuesCount(shuffleParameters.rpRanges));
                l(winnersToString());
            }
        }
    }
}

/*
    * Run lots of events with randomness
*/
function runExhaustive() {
    for (let i = 0; i < 100; i++) {
        // New lottery

        // Initialize the lottery values
        let totalWinners = 3;
        let maxParticipantsCount = 25000;
        resetValues(totalWinners, maxParticipantsCount, false);

        for (let j = 0; j < 200; j++) {
            // Apply an event
            
            if(fulfillRandomness()) {
                l(rangesToString(shuffleParameters.rpRanges));
                l(getRangesBoundedValuesCount(shuffleParameters.rpRanges));
                l(winnersToString());
            }
        }
    }
}

//runTest();
runExhaustive();

export type {
    IRange
};