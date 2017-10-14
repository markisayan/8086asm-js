const should = require( 'should' );
const Interpreter = require( "../interpreter" );
const machine = require( '../machine' );

const asmInterpreter = new Interpreter( machine );

describe( 'Binary Arithmetic', function () {
  describe( 'ADD instruction', function () {
    beforeEach( () => {
      asmInterpreter.machine.reset();
      asmInterpreter.machine.setRegisterValue( 'bx', 15 );
    } );

    it( 'should successfully add an immediate value to two byte register', function () {
      asmInterpreter.interpret( "add ax, 0" );
      const status = machine.getStatus().getHex();

      status.should.be.of.type( 'object' );

      status.memory.should.be.empty();
      status.stack.should.be.empty();

      status.registers.ax.should.equal( '0' );

      status.flags.of.should.equal( 0 );
      status.flags.df.should.equal( 0 );
      status.flags.if.should.equal( 1 );
      status.flags.sf.should.equal( 0 );
      status.flags.zf.should.equal( 1 );
      status.flags.pf.should.equal( 0 );
      status.flags.cf.should.equal( 0 );
      status.flags.af.should.equal( 0 );

    } );

    it( 'should successfully add an immediate value to one byte register', function () {
      asmInterpreter.interpret( "add ah, 10" );
      const status = machine.getStatus().getHex();

      status.should.be.of.type( 'object' );

      status.memory.should.be.empty();
      status.stack.should.be.empty();

      status.registers.ax.should.equal( '1000' );

      status.flags.of.should.equal( 0 );
      status.flags.df.should.equal( 0 );
      status.flags.if.should.equal( 1 );
      status.flags.sf.should.equal( 0 );
      status.flags.zf.should.equal( 0 );
      status.flags.pf.should.equal( 1 );
      status.flags.cf.should.equal( 0 );
      status.flags.af.should.equal( 0 );

    } );

    it( 'should fail to add immediate value that is too big to one byte register', function ( done ) {
      try {
        asmInterpreter.interpret( "add ah, 100" );
        done( "" );
      } catch ( err ) {
        done();
      }

    } );


    it( 'should fail to add immediate value that is too big to two byte register', function ( done ) {
      try {
        asmInterpreter.interpret( "add ax, 10000" );
        done( "" );
      } catch ( err ) {
        done();
      }

    } );

    it( 'should successfully add two two byte registers', function ( ) {
      machine.setRegisterValue( 'ax', 0x1 );
      machine.setRegisterValue( 'bx', 0xf );

      asmInterpreter.interpret( "add ax, bx" );
      const status = machine.getStatus().getHex();

      status.should.be.of.type( 'object' );

      status.memory.should.be.empty();
      status.stack.should.be.empty();

      status.registers.ax.should.equal( '10' );

      status.flags.of.should.equal( 0 );
      status.flags.df.should.equal( 0 );
      status.flags.if.should.equal( 1 );
      status.flags.sf.should.equal( 0 );
      status.flags.zf.should.equal( 0 );
      status.flags.pf.should.equal( 1 );
      status.flags.cf.should.equal( 0 );
      status.flags.af.should.equal( 1 );
    } );

    it( 'should successfully add two one byte registers', function ( ) {
      machine.setRegisterValue( 'ah', 0x1 );
      machine.setRegisterValue( 'bl', 0xf );

      asmInterpreter.interpret( "add ah, bl" );
      const status = machine.getStatus().getHex();

      status.should.be.of.type( 'object' );

      status.memory.should.be.empty();
      status.stack.should.be.empty();

      status.registers.ax.should.equal( '10' );

      status.flags.of.should.equal( 0 );
      status.flags.df.should.equal( 0 );
      status.flags.if.should.equal( 1 );
      status.flags.sf.should.equal( 0 );
      status.flags.zf.should.equal( 0 );
      status.flags.pf.should.equal( 1 );
      status.flags.cf.should.equal( 0 );
      status.flags.af.should.equal( 1 );
    } );
  } );
} );