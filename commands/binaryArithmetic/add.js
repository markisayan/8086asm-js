"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Add extends AsmCommand {
  constructor ( machine, interpreter ) {
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

  setFlags(dest, src){

  }

  execute ( args ) {
    if(this.interpreter.isMemory(args[0]) && this.interpreter.isMemory(args[1])){
      throw new Error("Arguments can't be both a memory address");
    }

    if ( this.interpreter.isRegister(args[ 0 ]) && this.interpreter.isRegister(args[ 1 ]) ) {
      let destRegName = args[0];
      let destRegVal = this.machine.getRegisterValue( destRegName );

      let srcRegName = args[1];
      let srcRegVal = this.machine.getRegisterValue( srcRegName );

      this.machine.setRegisterValue(destRegName, destRegVal + srcRegVal);
    }
    else if ( this.interpreter.isRegister(args[ 0 ]) && this.interpreter.isImmediate(args[ 1 ]) ) {
      let destRegName = args[0];
      let destRegVal = this.machine.getRegisterValue( destRegName );

      let srcImmValue = this.fromHexToDecimal(args[1]);

      this.machine.setRegisterValue(destRegName, srcImmValue + destRegVal);
    }
    else if( this.interpreter.isRegister(args[0]) && this.interpreter.isMemory(args[1])){
      let destRegName = args[0];
      let destRegVal = this.machine.getRegisterValue(destRegName);

      let srcMemAddress = this.machine.getRegisterValue(args[1].substr(1, args[1].length - 2));
      let srcMemVal = this.machine.getMemoryValue(srcMemAddress);

      this.machine.setRegisterValue(destRegName, destRegVal + srcMemVal);
    }
    else if(this.interpreter.isMemory(args[0]) && this.interpreter.isRegister(args[1])){
      let destMemAddr = this.machine.getRegisterValue(args[0].substr(1, args[0].length - 2));
      let destMemVal = this.machine.getMemoryValue(destMemAddr);

      let srcRegName = args[1];
      let srcRegVal = this.machine.getRegisterValue(srcRegName);

      this.machine.setMemoryValue(destMemAddr, destMemVal + srcRegVal);

    }
    else if (this.interpreter.isMemory(args[0]) && this.interpreter.isImmediate(args[1])){
      let destMemAddr = this.machine.getRegisterValue(args[0].substr(1, args[0].length - 2));
      let destMemVal = this.machine.getMemoryValue(destMemAddr);

      let srcImmVal = parseInt(args[1], 16);

      this.machine.setMemoryValue(destMemAddr, destMemVal + srcImmVal);
    }

    // TODO: CHANGE FLAGS ACCORDINGLY
  }
}

module.exports = Add;