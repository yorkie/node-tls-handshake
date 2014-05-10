
var constants = require('./constants');
var types = constants.Handshake.Types;



var ClientHello = {
  /*
   * Tls version
   */
  get version () {
    return this._version || versions['1.1'];
  },

  /*
   * Tls version
   */
  set version (val) {
    this._version = versions[val] || versions['1.1'];
  },

  /*
   * Tls session id
   */
  get sessionId () {
    return this._sessionId;
  },

  /*
   * Tls session id
   */
  set sessionId (val) {
    this._sessionId = val || 0;
  },

  /*
   * Tls content type
   */
  get type () {
    return this._type || types['handshake'];
  },
  
  /*
   * Tls content type
   */
  set type (val) {
    this._type = types[val] || types['handshake'];
  },

  /*
   * Tls fragment length
   */
  get length () {
    return this._length || 0;
  },

  /*
   * Tls fragment length
   */
  set length (val) {
    throw new Error('internal usage');
  },

  /*
   * Tls fragment
   */
  get body () {
    return this._body;
  },

  /*
   * Tls fragment
   */
  set body (val) {
    this._body = val;
    this._length = val.length;
  },
};

module.exports = {

  /*
   * handshake type
   */
  get type () {
    return this._type || types['client_hello'];
  },

  /*
   * handshake type
   */
  set type (val) {
    this._type = types[val] || types['client_hello'];
  },

  /*
   * handshake fragment length
   */
  get length () {
    return this._length || 0;
  },

  /*
   * handshake fragment length
   */
  set length (val) {
    throw new Error('internal usage');
  },

  /*
   * handshake body
   */
  get body () {
    return this._body;
  },

  /*
   * handshake body
   */
  set body (val) {

  }

};

function generateRandom() {
  var buf = new Buffer(32);
  buf.writeUint32BE(Date.now(), 0);
  buf.fill('0', 4, 27);
  return buf;
}

