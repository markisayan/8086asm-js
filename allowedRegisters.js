"use strict";

class AllowedRegisters {
  get instructionPointerRegister () {
    return [ "ip" ];
  }

  get generalPurposeRegisters () {
    return [ "ax", "ah", "al", "bx", "bh", "bl", "cx", "ch", "cl", "dx", "dh", "dl" ];
  }

  get segmentRegisters () {
    return [ "es", "cs", "ss", "ds" ];
  }

  get specialPurposeRegisters () {
    return [ "si", "di", "sp", "bp" ];
  }

  get allRegisters () {
    return [].concat.apply([], [
      this.instructionPointerRegister,
      this.generalPurposeRegisters,
      this.segmentRegisters,
      this.specialPurposeRegisters
    ]);
  }
}

module.exports = new AllowedRegisters();