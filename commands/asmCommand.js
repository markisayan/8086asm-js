"use strict";

class AsmCommand{
  constructor (machine, commandArgTypes, numArgs = 2){
    this.numArgs = numArgs;
    this.machine = machine;
    this.commandArgTypes = commandArgTypes;
  }
}

module.exports = AsmCommand;