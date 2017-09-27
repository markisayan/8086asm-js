"use strict";
class AsmCommand {
  constructor ( machine, interpreter, commandArgTypes, numArgs = 2 ) {
    this.numArgs = numArgs;
    this.machine = machine;
    this.interpreter = interpreter;
    this.commandArgTypes = commandArgTypes;
  }

  fromHexToDecimal ( arg ) {
    return parseInt(arg, 16)
  }
}

module.exports = AsmCommand;