"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Mov extends AsmCommand {
  constructor(machine, interpreter) {
    let commandArgTypes = [
      [
        argTypes.REGISTER,
        argTypes.SPECIAL_PURPOSE_REGISTER,
        argTypes.SEGMENT_REGISTER,
        argTypes.MEMORY
      ],
      [
        argTypes.REGISTER,
        argTypes.SPECIAL_PURPOSE_REGISTER,
        argTypes.SEGMENT_REGISTER,
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
      if (dest[dest.length - 1] !== src[src.length - 1]) {
        throw new Error("Registers should have the same size");
      }

      const destRegName = dest;
      const srcRegName = src;
      const srcRegVal = this.machine.getRegisterValue(src);

      this.machine.setRegisterValue(destRegName, srcRegVal);
    }else if(this.interpreter.isRegister(dest) && this.interpreter.isImmediate(src)){
      const destRegName = dest;
      const srcImmVal = this.fromHexToDecimal(src);

      this.machine.setRegisterValue(destRegName, srcImmVal);
    }
  }

}

module.exports = Mov;