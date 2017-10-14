"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Add extends AsmCommand {
  constructor(machine, interpreter) {
    let commandArgTypes = [
      [
        argTypes.GENERAL_PURPOSE_REGISTER,
        argTypes.SPECIAL_PURPOSE_REGISTER,
        argTypes.MEMORY
      ],
      [
        argTypes.GENERAL_PURPOSE_REGISTER,
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

    this.machine.setFlagValue("pf", (numOfOnes & 1) | 0);
  }

  setZf(result) {
    this.machine.setFlagValue("zf", (result === 0) | 0);
  }

  setOf(firstVal, secondVal, result) {
    const ofValue = ( ((firstVal >>> 15) & 1) === 0 && ((secondVal >>> 15) & 1) === 0 && ((result >>> 15) & 1) === 1 ||
      (( firstVal >>> 15) & 1) === 1 && ((secondVal >>> 15) & 1) === 1 && ((result >>> 15) & 1) === 0);

    this.machine.setFlagValue("of", ofValue | 0);
  }

  setCf(result) {
    this.machine.setFlagValue("cf", ((result & 0x0000) !== 0) | 0);
  }

  setSf(result) {
    this.machine.setFlagValue("sf", (result & 0xFFFF) >>> 15);
  }

  setAf(srcVal, destVal) {
    const lowNibbleSrcVal = srcVal & 0xf;
    const lowNibbleDestVal = destVal & 0xf;
    const sum = lowNibbleSrcVal + lowNibbleDestVal;
    this.machine.setFlagValue("af", (sum >>> 4) | 0);
  }

  setFlags(destVal, srcVal, result){
    this.setCf(result);
    this.setPf(result);
    this.setSf(result);
    this.setZf(result);
    this.setAf(srcVal, destVal);
    this.setOf(destVal, srcVal, result);
    this.machine.setFlagValue("if", 1);
  }

  execute(args) {
    let [dest, src] = [...args];

    if (this.interpreter.isMemory(dest) && this.interpreter.isMemory(src)) {
      throw new Error("Arguments can't be both a memory address");
    }

    if (this.interpreter.isRegister(dest) && this.interpreter.isRegister(src)) {
      if (this.interpreter.isTwoByteRegister(src) !== this.interpreter.isTwoByteRegister(dest)) {
        throw new Error("Registers should have the same size");
      }

      const destRegName = dest;
      const destRegVal = this.machine.getRegisterValue(destRegName);

      const srcRegName = src;
      const srcRegVal = this.machine.getRegisterValue(srcRegName);

      const result = destRegVal + srcRegVal;

      if(this.interpreter.isOneByteRegister(srcRegName)) {
        const twoByteSrcVal = this.machine.getRegisterValue(srcRegName[0] + 'x');
        const twoByteDestVal = this.machine.getRegisterValue(destRegName[0] + 'x');

        this.setFlags( twoByteDestVal, twoByteSrcVal, result );
      }

      this.machine.setRegisterValue(destRegName, result & 0xFFFF);
    }
    else if (this.interpreter.isRegister(dest) && this.interpreter.isImmediate(src)) {
      const destRegName = dest;
      const destRegVal = this.machine.getRegisterValue(destRegName);

      const srcImmVal = this.fromHexToImmediate(src);

      if(this.interpreter.isOneByteRegister(dest) && srcImmVal > 0xff){
        throw new Error("Value is bigger than 1 byte");
      }

      if(this.interpreter.isTwoByteRegister(dest) && srcImmVal > 0xffff){
        throw new Error("Value is bigger than 2 bytes");
      }

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

        this.setFlage(destMemVal, srcRegVal, result);

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

      this.machine.setMemoryValue(destMemAddr, result & 0xFF);
    }
  }
}

module.exports = Add;