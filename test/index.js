var assert = require('assert');
var sinon = require('sinon');
var series = require('..');

describe('series', function() {
  it('should work', function(done) {
    var spy = sinon.spy();
    var cbSpy = sinon.spy();

    series([1, 2, 3], spy, cbSpy);

    assert(spy.calledOnce);
    assert(spy.calledWith(1));

    spy.callArg(1);
    assert(spy.calledTwice);
    assert(spy.calledWith(2));

    spy.callArg(1);
    assert(spy.calledThrice);
    assert(spy.calledWith(3));

    spy.callArg(1);
    setTimeout(function() {
      assert(spy.calledThrice);
      assert(cbSpy.calledOnce);
      assert(cbSpy.calledWith(null));
      done();
    });
  });

  it('should work with errors', function(done) {
    var errSpy = sinon.spy(function(val, cb) { cb(new Error); });
    var throwSpy = sinon.spy(function(val, cb) { throw new Error; });
    var cbSpy = sinon.spy();

    series([1, 2], errSpy, cbSpy);
    setTimeout(function() {
      assert(cbSpy.calledOnce);
      errSpy.callArg(1);
      // Make sure it doesn't let you call cb twice when
      // an error happens
      assert(cbSpy.calledOnce);
      assert(errSpy.calledOnce);
      assert(! cbSpy.calledWith(null));

      cbSpy.reset();
      series([1, 2], throwSpy, cbSpy);

      setTimeout(function() {
        assert(cbSpy.calledOnce);
        assert(throwSpy.calledOnce);

        // Ditto for a thrown error;
        throwSpy.callArg(1);
        assert(cbSpy.calledOnce);
        assert(throwSpy.calledOnce);
        assert(! cbSpy.calledWith(null));

        done();
      });
    });
  });
});