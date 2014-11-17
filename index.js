var Transform = require('readable-stream').Transform;
var util = require('util');

function Hooklock (options) {

	var that = this;
	options = options || {};
	if(!(that instanceof Hooklock)) {
		return new Hooklock(options);
	}
	Transform.call(that, {
		objectMode: true
	});

	var clock = options.clock || require('right-now');
	that._clock = (typeof clock === 'function') ?
		clock :
		function () { return clock; };
	that._threshold = options.threshold || 100;
  that._latency = options.latency || 100;
	that._offset = 0;

}

// Methods
util.inherits(Hooklock, Transform);
Hooklock.prototype._transform = function (data, encoding, next) {

	var that = this;
	var threshold = that._threshold;
	var tIn = data.timestamp;
	var now = that._clock();
	var ta = tIn - that._offset;

	if((tIn - that._offset) < (now - threshold)) {
		// calibrate offset
	  that._offset = tIn - now;
	}
	data.timestamp = tIn - that._offset + that._latency;

	if(data.type !== 'sync') {
		this.push(data);
	}
	next(null);
};

module.exports = Hooklock;
