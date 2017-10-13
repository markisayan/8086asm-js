"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Add extends AsmCommand {
  constructor(machine, interpreter) {
    let commandArgTypes = [
      [
        argTypes.REGISTER,
        argTypes.SPECIAL_PURPOSE_REGISTER,
        argTypes.MEMORY
      ],
      [
        argTypes.REGISTER,
        argTypes.SPECIAL_PURPOSE_REGISTER,
        argTypes.MEMORY,
        argTypes.IMMEDIATE
      ]
    ];
    super(machine, interpreter, commandArgTypes);
  }

  setPf(result) {
    let numOfOnes = 0;

    while (result !== 0) {
      numOfOnes += result & 1;
      result >>>= 1;
    }

    this.machine.setFlagValue("pf", + !(numOfOnes & 1));
  }

  setZf(result) {
    this.machine.setFlagValue("zf", + (result === 0));
  }

  setOf(firstVal, secondVal, result) {
    const ofValue = ( ((firstVal >>> 15) & 1) === 0 && ((secondVal >>> 15) & 1) === 0 && ((result >>> 15) & 1) === 1 ||
      (( firstVal >>> 15) & 1) === 1 && ((secondVal >>> 15) & 1) === 1 && ((result >>> 15) & 1) === 0);

    this.machine.setFlagValue("of", + ofValue);
  }

  setCf(result) {
    this.machine.setFlagValue("cf", +((result & 0xFFFF) !== 0));
  }

  setSf(result) {
    this.machine.setFlagValue("sf", (result & 0xFFFF) >>> 15);
  }

  setAf(oldVal, result) {
    this.machine.setFlagValue("af", + (((oldVal >> 2) & 1 === 0) && ((result >> 2) & 1) === 1));
  }

  setFlags(destVal, srcVal, result){
    this.setCf(result);
    this.setPf(result);
    this.setSf(result);
    this.setZf(result);
    this.setAf(destVal, result);
    this.setOf(destVal, srcVal, result);
  }

  execute(args) {
    let [dest, src] = [...args];

    if (this.interpreter.isMemory(dest) && this.interpreter.isMemory(src)) {
      throw new Error("Arguments can't be both a memory address");
    }

    if (this.interpreter.isRegister(dest) && this.interpreter.isRegister(src)) {
      if (dest[dest.length - 1] !== src[src.length - 1]) {
        throw new Error("Registers should have the same size");
      }

      const destRegName = dest;
      const destRegVal = this.machine.getRegisterValue(destRegName);

      const srcRegName = src;
      const srcRegVal = this.machine.getRegisterValue(srcRegName);

      const result = destRegVal + srcRegVal;
      this.setFlags(destRegVal, srcRegVal, result);

      this.machine.setRegisterValue(destRegName, result & 0xFFFF);
    }
    else if (this.interpreter.isRegister(dest) && this.interpreter.isImmediate(src)) {
      const destRegName = dest;
      const destRegVal = this.machine.getRegisterValue(destRegName);

      const srcImmVal = this.fromHexToDecimal(src);

      const result = srcImmVal + destRegVal;
      
      this.setFlags(destRegVal, srcImmVal, result);

      this.machine.setRegisterValue(destRegName, result & 0xFFFF);
    }
    else if (this.interpreter.isRegister(dest) && this.interpreter.isMemory(src)) {

      const destRegName = dest;
      const destRegVal = this.machine.getRegisterValue(destRegName);

      const srcMemAddress = this.machine.getRegisterValue(src.substr(1, src.length - 2));
      let srcMemVal = 0;

      if (this.interpreter.isTwoByteRegister(dest)) {
        let srcMemValLo = this.machine.getMemoryValue(srcMemAddress);
        let srcMemValHi = this.machine.getMemoryValue(srcMemAddress + 1);

        srcMemVal = srcMemValHi;
        srcMemVal <<= 8;
        srcMemVal |= srcMemValLo;
      } else {
        srcMemVal = this.machine.getMemoryValue(srcMemAddress);
      }
      
      const result = destRegVal + srcMemVal;

      this.setFlags(destRegVal, srcMemVal, result);

      this.machine.setRegisterValue(destRegName, result & 0xFFFF);
    }
    else if (this.interpreter.isMemory(dest) && this.interpreter.isRegister(src)) {
      const srcRegName = src;
      const srcRegVal = this.machine.getRegisterValue(srcRegName);

      if (this.interpreter.isTwoByteRegister(srcRegName)) {
        const destMemAddrLo = this.machine.getRegisterValue(dest.substr(1, dest.length - 2));
        const destMemValLo = this.machine.getMemoryValue(destMemAddrLo);

        const destMemAddrHi = destMemAddrLo + 1;
        const destMemValHi = this.machine.getMemoryValue(destMemAddrHi);

        let destMemVal = destMemValHi;
        destMemVal <<= 8;
        destMemVal |= destMemValLo;

        const result = destMemVal + srcRegVal;

        this.setFlage(destMemVal, srcRegVal, result)

        this.machine.setMemoryValue(destMemAddrLo, result & 0xFF);
        this.machine.setMemoryValue(destMemAddrHi, (result >>> 8) & 0xFF);
      } else {
        const destMemAddr = this.machine.getRegisterValue(dest.substr(1, dest.length - 2));
        const destMemVal = this.machine.getMemoryValue(destMemAddr);

        const result = destMemVal + srcRegVal;

        this.setFlags(destMemVal, srcRegVal, result);

        this.machine.setMemoryValue(destMemAddr, result & 0xFFFF);
      }

    }
    else if (this.interpreter.isMemory(dest) && this.interpreter.isImmediate(src)) {
      const destMemAddr = this.machine.getRegisterValue(dest.substr(1, dest.length - 2));
      const destMemVal = this.machine.getMemoryValue(destMemAddr);

      const srcImmVal = parseInt(src, 16);
      
      const result = destMemVal + srcImmVal;

      this.setFlags(destMemVal, srcImmVal, result);

      this.machine.setMemoryValue(destMemAddr, result);
    }
  }
}

module.exports = Add;