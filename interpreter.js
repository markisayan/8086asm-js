"use strict";

const argTypes = require("./argTypes");
const allowedRegisters = require('./allowedRegisters');

class ASMInterpreter {
  constructor ( machine ) {
    this.commands = {
      add: "binaryArithmetic/add",
      adc: "binaryArithmetic/adc",
      // adc: "binaryArithmetic/adc",
      // sub: "binaryArithmetic/sub",
      // sbb: "binaryArithmetic/sbb",
      mov: "move/mov",
      clc: "flagManipulation/clc",
      cld: "flagManipulation/cld",
      cli: "flagManipulation/cli",
      cmc: "flagManipulation/cmc",
      stc: "flagManipulation/stc",
      std: "flagManipulation/std",
      sti: "flagManipulation/sti"
    };

    Object.keys(this.commands).forEach(key => {
      const Operation = require("./commands/" + this.commands[ key ]);
      this.commands[ key ] = new Operation(machine, this);
    });

    this.machine = machine;
  }

  isRegister ( arg ) {
    return allowedRegisters.allRegisters.indexOf(arg) !== -1;
  }

  isMemory ( arg ) {
    return arg[0] === "[" && arg[arg.length - 1] === "]" && this.isRegister(arg.substr(1, arg.length - 2));
  }

  isSegmentRegister ( arg ) {
    return allowedRegisters.segmentRegisters.indexOf(arg) !== -1;
  }

  isGeneralPurposeRegister ( arg ) {
    return allowedRegisters.generalPurposeRegisters.indexOf(arg) !== -1;
  }

  isSpecialPurposeRegister (arg){
    return allowedRegisters.specialPurposeRegisters.indexOf(arg) !== -1;
  }

  isTwoByteRegister(arg){
    return !this.isOneByteRegister(arg) ;
  }

  isOneByteRegister(arg){
    return this.isRegister(arg) && (arg[arg.length - 1] === 'h' || arg[arg.length -1] === 'l');
  }

  isImmediate ( arg ) {
    return !this.isRegister(arg) && !this.isMemory(arg) && (parseInt(arg, 16) || parseInt(arg, 16) === 0);
  }

  isCorrectArgType ( arg, argType ) {
    switch ( argType ) {
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

  hasValidArgumentTypes ( command, args ) {
    for ( let i = 0; i < args.length; i++ ) {
      let found = false;
      for ( let j = 0; j < command.commandArgTypes[ i ].length; j++ ) {
        let argType = command.commandArgTypes[ i ][ j ];
        if ( this.isCorrectArgType(args[ i ], argType) ) {
          found = true;
          break;
        }
      }
      if ( !found )
        return false;
    }
    return true;
  }

  splitToTokens ( commandString ) {
    commandString = commandString.toLowerCase();
    let tokens = commandString.trim().replace(/,/g, " ").split(" ");

    let filteredTokens = tokens.filter(token => {
      return token !== "";
    });

    return filteredTokens;
  }

  interpret ( string ) {
    const tokens = this.splitToTokens(string);
    let [ commandString, ...args ] = tokens;

    if ( !this.commands[ commandString ] ) {
      throw new Error("Command doesn't exist");
    }
    else {
      let command = this.commands[ commandString ];

      if ( command.numArgs !== args.length ) {
        throw new Error("Wrong number of arguments");
      }

      if ( this.hasValidArgumentTypes(command, args) ) {
        command.execute(args, this);
      } else {
        throw new Error("Command arguments have wrong types");
      }

    }
  }
}

module.exports = ASMInterpreter;