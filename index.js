"use strict";

const asmMachine = require("./machine");
const AsmInterpreter = require("./interpreter");
const asmInterpreter = new AsmInterpreter(asmMachine);

class ASM {
  interpret(command, callback){
    asmInterpreter.interpret(command);
    callback(this.status);
  }

  get status(){
    return asmMachine.getStatus().getHex();
  }
}

module.exports = new ASM();
