import { BigNumber, BigNumberish } from "ethers";

const uint8_MIN_VALUE = "0x00";
const uint8_MAX_VALUE = "0xFF"; // 1 byte
const uint256_MIN_VALUE = "0x00";
const uint256_MAX_VALUE = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"; // 32 bytes

class Integer {
    value: BigNumber;
    
    constructor(_value: BigNumberish, _minValueHex: string, _maxValueHex: string) {
        _value = BigNumber.from(_value);
        if(_value.lt(_minValueHex) || _value.gt(_maxValueHex)) {
            throw `Invalid integer: ${_value}`;
        }
        this.value = _value;
    }
    
    /*toString() {
        return this.value.toString();
    }*/
    
    // BigNumber.js 
    // Hexable interface (takes priority)
    toHexString() {
        return this.value.toHexString();
    }
}

class uint8 extends Integer {
    constructor(_value: BigNumberish) {
        super(_value, uint8_MIN_VALUE, uint8_MAX_VALUE);
    }
}

class uint256 extends Integer {
    constructor(_value: BigNumberish) {
        super(_value, uint256_MIN_VALUE, uint256_MAX_VALUE);
    }
}

export {
    uint8_MIN_VALUE,
    uint8_MAX_VALUE,
    uint256_MIN_VALUE,
    uint256_MAX_VALUE,
    uint8,
    uint256
}