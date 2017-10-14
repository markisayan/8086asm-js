"use strict";

const AsmCommand = require("../asmCommand");
const argTypes = require("../../argTypes");

class Mov extends AsmCommand {
  constructor(machine, interpreter) {
    super(machine, interpreter, [], 0);
  }

  execute(){
    this.machine.setFlagValue('df', 0);
  }

}

module.exports = Mov;