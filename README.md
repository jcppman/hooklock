# Hooklock

Hook + Clock = Hooklock, hook your clocks together

## Introduction

This module provides you a `stream.Transform` that lock your local clock with 
source clock.

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
