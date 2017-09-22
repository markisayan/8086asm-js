"use strict";
const allowedRegisters = require('./allowedRegisters');

let registers = {
  ax: 1,
  cx: 0,
  dx: 0,
  bx: 9,
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

function toHex(data){
  if(Array.isArray(data)){
    for(let index in data){
      for(let key in data[index]){
        data[index][ key ] = data[index][ key ].toString(16);
      }
    }
  }else {
    for ( let key in data ) {
      data[ key ] = data[ key ].toString(16);
    }
  }

  return data;
}

class ASMMachine {
  setRegister(registerName, value){
    if(allowedRegisters.allRegisters.indexOf(registerName) === -1)
      throw new Error("Register with that name doesn't exist");

    
    if(registerName[registerName.length - 1] === 'h'){
      

      // Leaving only 1 byte, clearing the rest and shifting it to the right by 8 bits
      value &= 0xFF;
      value <<= 8;

      const twoByteRegister = registerName[0] + 'x';


      
      // Clearing the last byte
      registers[twoByteRegister] &= 0xFF;
      // Setting the last byte
      registers[twoByteRegister] |= value;


      return;
    }

    if(registerName[registerName.length - 1] === 'l'){
      // Keeping only 1 byte of the value
      value &= 0xFF;

      const twoByteRegister = registerName[0] + 'x';
      // Clearing the first byte
      registers[twoByteRegister] &= 0xFF00;
      // Setting the first byte
      registers[twoByteRegister] |= value;
      return;
    }

    registers[registerName] = value;
  }

  getRegister(register){
    if(allowedRegisters.allRegisters.indexOf(register) === -1)
      throw new Error("Register with that name doesn't exist");

    if(register[register.length - 1] === 'h'){
      const twoByteRegister = register[0] + 'x';
      
      return registers[twoByteRegister] >>> 8;
    }

    if(register[register.length - 1] === 'l'){
      const twoByteRegister = register[0] + 'x';
      return registers[twoByteRegister] & 0xFF;
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
    return Object.assign([], flags);
  }

  get stack(){
    return Object.assign([],stack);
  }

  getStatus(){
    return {
      data: this.data,
      registers: this.registers,
      stack: this.stack,
      flags: this.flags,

      getHex: function(){
        return {
          data: toHex(this.data),
          registers: toHex(this.registers),
          stack: this.stack,
          flags: toHex(this.flags),
        }
      }
    }
  }
}

module.exports = new ASMMachine();