"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Mov extends AsmCommand {
  constructor(machine, interpreter) {
    let commandArgTypes = [
      [
        argTypes.REGISTER,
        argTypes.MEMORY
      ],
      [
        argTypes.REGISTER,
        argTypes.MEMORY,
        argTypes.IMMEDIATE
      ]
    ];
    super(machine, interpreter, commandArgTypes);
  }

  execute(args){
    let [dest, src] = [...args];

    if (this.interpreter.isMemory(dest) && this.interpreter.isMemory(src)) {
      throw new Error("Arguments can't be both a memory address");
    }

    if(this.interpreter.isImmediate(dest)){
      throw new Error("Destination can't be an immediate value");
    }

    if(this.interpreter.isSegmentRegister(src) && this.interpreter.isSegmentRegister(dest)){
      throw new Error("Arguments can't be both segment registers");
    }

    if(this.interpreter.isRegister(dest) && this.interpreter.isRegister(src)){
      if (this.machine.isTwoByteRegister(dest) !== this.machine.isTwoByteRegister(src)) {
        throw new Error("Registers should have the same size");
      }

      if(dest === 'cs' || dest === 'ip'){
        throw new Error("Destination can't be cs or ip registers");
      }

      const destRegName = dest;
      const srcRegName = src;
      const srcRegVal = this.machine.getRegisterValue(src);

      this.machine.setRegisterValue(destRegName, srcRegVal);
    }else if(this.interpreter.isRegister(dest) && this.interpreter.isImmediate(src)){
      const destRegName = dest;
      const srcImmVal = this.fromHexToImmediate(src);

      if(destRegName === 'cs' || destRegName === 'ip'){
        throw new Error("Destination can't be cs or ip registers");
      }

      if(this.interpreter.isOneByteRegister(dest) && srcImmVal > 0xff){
        throw new Error("Value is bigger than 1 byte");
      }

      if(this.interpreter.isTwoByteRegister(dest) && srcImmVal > 0xffff){
        throw new Error("Value is bigger than 2 bytes");
      }

      this.machine.setRegisterValue(destRegName, srcImmVal);
    }

    //TODO:
  }

}

module.exports = Mov;