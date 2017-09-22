"use strict";
const allowedRegisters = require('./allowedRegisters');

let registers = {
  ax: 1,
  cx: 0,
  dx: 0,
  bx: 2,
  sp: 0,
  bp: 0,
  si: 0,
  di: 0,
  cs: 0,
  ds: 0,
  ss: 0,
  es: 0,
  ip: 0
};

let flags = [
  { cf: 0 },
  { unknown: 1 },
  { pf: 0 },
  { unknown: 0 },
  { af: 0 },
  { unknown: 0 },
  { zf: 0 },
  { sf: 0 },
  { tf: 0 },
  { if: 0 },
  { df: 0 },
  { of: 0 },
  { iopl: 0 },
  { nt: 0 },
  { unknown: 0 }
];

let stack = [];

let data = {};

class ASMMachine {
  setRegister(register, value){
    if(allowedRegisters.allRegisters.indexOf(register) === -1)
      throw new Error("Register with that name doesn't exist");

    if(register[register.length - 1] === 'h'){
      value &= 0xFF;
      value <<= 8;

      const fullRegister = register[0] + 'x';

      registers[fullRegister] &= 0xFF;
      registers[fullRegister] |= value;
      return;
    }

    if(register[register.length - 1] === 'l'){
      value &= 0xFF;

      const fullRegister = register[0] + 'x';
      registers[fullRegister] &= 0xFF00;
      registers[fullRegister] |= value;
      return;
    }

    registers[register] = value;
  }

  getRegister(register){
    if(allowedRegisters.allRegisters.indexOf(register) === -1)
      throw new Error("Register with that name doesn't exist");

    if(register[register.length - 1] === 'h'){
      const fullRegister = register[0] + 'x';
      return registers[fullRegister] >>> 8;
    }

    if(register[register.length - 1] === 'l'){
      const fullRegister = register[0] + 'x';
      return registers[fullRegister] & 0xFF;
    }

    return registers[register];
  }

  get registers(){
    return Object.assign({}, registers);
  }

  get data(){
    return Object.assign({}, data);
  }

  get flags(){
    return Object.assign({}, flags);
  }

  get stack(){
    return Object.assign({}, stack);
  }

  getStatus(){
    return {
      data: this.data,
      registers: this.registers,
      stack: this.stack,
      flags: this.flags
    }
  }
}

module.exports = new ASMMachine();