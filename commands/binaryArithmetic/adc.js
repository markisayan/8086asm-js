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
      this.machine.setRegisterValue(args[0], this.machine.getRegisterValue(args[0]) + this.machine.getRegisterValue(args[1]));
    }
  }
}

module.exports = Add;