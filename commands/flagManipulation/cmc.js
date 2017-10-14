"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Mov extends AsmCommand {
  constructor(machine, interpreter) {
    super(machine, interpreter, [], 0);
  }

  execute(){
    const oldVal = this.machine.getFlagValue('cf');
    this.machine.setFlagValue('cf', !oldVal | 0);
  }

}

module.exports = Mov;