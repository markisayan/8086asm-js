"use strict";

const asmMachine = require("./machine");
const AsmInterpreter = require("./interpreter");
const asmInterpreter = new AsmInterpreter(asmMachine);

class ASM {
  interpret(command){
    asmInterpreter.interpret(command);
  }

  get status(){
    return asmMachine;
  }
}

module.exports = new ASM();
