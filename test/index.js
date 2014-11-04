var Hooklock = require('../');
var assert = require('assert');
var async = require('async');
var through = require('through2');
var timer = require('right-now');

describe('Hooklock', function () {

	describe('Common', function () {

		var seq;
		var timeline;

		before(function () {
			seq = [
				20000,
				21000,
				30900,
				31030,
				49150,
				59080,
				91200
			];
		});

		it('should keep timestamp of transformed events in order', function (done) {

			// Build
			var timeline = new Hooklock();
			timeline.pipe(through.obj(function (data, enc, next) {
				if(!this._line) {
					this._line = [];
				}
				this._line.push(data.timestamp);
				next(null);
			}, function () {
				// intervals should be the same
				this._line.sort().forEach(function (item, idx, arr) {
					assert.equal(item-arr[0], seq[idx] - seq[0]);
				});
				done();
			}));

			// Start to write to stream
			async.eachSeries(seq, function (ts, next) {
				setTimeout(function () {
					timeline.write({
						timestamp: ts
					});
					next(null);
				}, Math.random() * 100);
			}, function (err) {
				if(err) console.log(err);
				timeline.end();
			});

		});
	});
});
