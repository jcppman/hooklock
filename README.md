# Hooklock

Hook + Clock = Hooklock, hook your clocks together

## Introduction

This module provides you a `stream.Transform` that lock your local clock with 
source clock.

Say you have wanna sync a sequence of timing-sensitive events (like MIDI data 
or game control events) with your local timeline (like Web Audio API
`currentTime` or nodejs `hrtime`). The offset between two events `eventA.time`
and `eventB.time` is `offset`, after transfer them to your local timeline
`eventA.happendAt` and `eventB.happendAt`, the
`newOffset = eventA.happenedAt - eventB.happenedAt` should remains the same (
`offset === newOffset`). `hooklock` will do the job for you.

If for some reason at some point a new transfered time is already behind the
current time, `hooklock` will re-align the two timelines to make sure all
following events are still retain the same intervals (Due to this strategy, 
the following events will be out-of-sync with previous events, so don't use 
this module if this is not your desired behavior).


## Usage

Init hooklock with options

```javascript
var Hooklock = require('hooklock'),
    options = {
        threshold: 100,
        latency: 200,
        clock: function () {
            var time = process.hrtime();
            return time[0] * 1e3 + time[1] / 1e6
        }
    };

var hook = new Hooklock(options);
```

All options are optional (This sentence sounds good, isn't it?). Default values
are: 
- `threshold`: 100
- `latency`: 100
- `clock`: use [right-now](https://github.com/hughsk/right-now)

After instantiation, you can start to pipe or write events to it.
```
    hook.write({
        data: Math.random(),
        timestamp: 50
    });

    hook.write({
        data: Math.random(),
        timestamp: 100
    });

    hook.write({
        data: Math.random(),
        timestamp: 150 
    });
```


