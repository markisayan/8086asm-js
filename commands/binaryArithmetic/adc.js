"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Add extends AsmCommand{
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

  execute(args){
    const cf = this.machine.getFlagValue('cf');
    this.interpreter.interpret(`add ${args.join()}`);
    this.interpreter.interpret(`add ${args[0]}, ${cf}`);
  }
}

module.exports = Add;