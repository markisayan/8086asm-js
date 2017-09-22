"use strict";

class AllowedRegisters {
  constructor () {
    this.instructionPointerRegister = [ "ip" ];
    this.generalPurposeRegisters = [ "ax", "ah", "al", "bx", "bh", "bl", "cx", "ch", "cl", "dx", "dh", "dl" ];
    this.segmentRegisters = [ "es", "cs", "ss", "ds" ];
    this.specialPurposeRegisters = [ "si", "di", "sp", "bp" ];
  }

  get allRegisters(){
    return [].concat.apply([], [
      this.instructionPointerRegister,
      this.generalPurposeRegisters,
      this.segmentRegisters,
      this.specialPurposeRegisters
    ]);
  }
}

module.exports =  new AllowedRegisters();