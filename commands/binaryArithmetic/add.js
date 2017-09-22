"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Add extends AsmCommand{
  constructor (machine){
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
    super(machine, commandArgTypes);
  }

  execute(args, interpreter){
    if(interpreter.isRegister(args[0]) && interpreter.isRegister(args[1])){
      this.machine.setRegister(args[0], this.machine.getRegister(args[0]) + this.machine.getRegister(args[1]));
    }
    else if(interpreter.isRegister(args[0]) && interpreter.isImmediateValue(args[1])){
      this.machine.setRegister(args[0], this.machine.getRegister(args[0]) + this.argumentsFromHexToDecimal(args[1]));
    }
    // TODO: HANDLE MEMORY PASSED AS ARG
    // TODO: CHANGE FLAGS ACCORDINGLY
  }
}

module.exports = Add;