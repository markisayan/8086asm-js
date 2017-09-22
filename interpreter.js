"use strict";

const argTypes = require("./argTypes");
const allowedRegisters = require('./allowedRegisters');
const ArgTypeHelper = require('./argTypeHelper');

class ASMInterpreter{
  constructor(machine){
    this.commands = {
      add: "binaryArithmetic/add",
      // adc: "binaryArithmetic/adc",
      // sub: "binaryArithmetic/sub",
      // sbb: "binaryArithmetic/sbb"
    };

    Object.keys(this.commands).forEach(key =>{
      const Operation = require("./commands/" + this.commands[key]);
      this.commands[key] = new Operation(machine);
    });

    this.machine = machine;
  }

  isRegister(arg){
    return allowedRegisters.allRegisters.indexOf(arg) !== -1;
  }

  isMemory(arg){
    return this.machine.data[arg] !== undefined;
  }

  isImmediateValue(arg){
    return !this.isRegister(arg) && !this.isMemory(arg);
  }

  isSegmentRegister(arg){
    return allowedRegisters.segmentRegisters.indexOf(arg) !== -1;
  }

  isGeneralPurposeRegister(arg){
    return allowedRegisters.generalPurposeRegisters.indexOf(arg) !== -1;
  }

  isImmediate(arg){
    return !isRegister(arg) && !isMemory(arg);
  }

  isCorrectType(arg, argType){
    switch(argType) {
      case argTypes.REGISTER:
        return this.isRegister(arg);
      case argTypes.IMMEDIATE:
        return this.isImmediate(arg);
      case argTypes.MEMORY:
        return this.isMemory(arg);
      case argTypes.SEGMENT_REGISTER:
        return this.isSegmentRegister(arg);
      case argTypes.GENERAL_PURPOSE_REGISTER:
        return this.isGeneralPurposeRegister(arg);
      default:
        return false;
    }
  }

  hasValidArgumentTypes(command, args){
    for(let i = 0; i < args.length; i++) {
      for(let j = 0; j < command.commandArgTypes[i].length; j++){
        let argType = command.commandArgTypes[i][j];
        if(this.isCorrectArgType(args[i], argType)){
          continue;
        }
      }
      return false;
    }
    return true;
  }

  interpret(string){
    const tokens = string.trim().split(" ");
    const [commandString, ...args] = tokens;

    if(!commands[commandString]) {
      throw new Error("Command doesn't exist");
    }
    else{
      let command = commands[commandString];

      if(command.numArgs != args.length){
        throw new Error("Wrong number of arguments");
      }

      if(hasValidArgumentTypes(command, args)){
        command.execute(args, this);
      }else{
        throw new Error("Command arguments have wrong types");
      }

    }
  }
}

module.exports = ASMInterpreter;