const c = require('chalk');
const morgan = require('morgan');

function colorStatus(status) {
  const format = status >= 500 ? c.bgRed
  : status >= 400 ? c.red.bold
    : status >= 300 ? c.cyan
      : status >= 200 ? c.green 
        : c.gray

  return format(status);
}

function formatLatency(v) {
    const format = v >= 600 ? c.bgRed
    : v >= 200 ? c.red.bold
      : v >= 100 ? c.yellow
        : c.green 
  
    return format(`${v} ms`.padStart(10, ' '));
}

function formatTotalTime(v) {
    const format = v >= 4000 ? c.bgRed
    : v >= 3000 ? c.red.bold
      : v >= 1000 ? c.yellow
        : c.green
  
    return format(`${v} ms`.padStart(9, ' '));
}

/*
The time between the request coming into `morgan` and when the response
has finished being written out to the connection, in milliseconds.

The `digits` argument is a number that specifies the number of digits to
include on the number, defaulting to `3`, which provides microsecond precision.
*/
morgan.token('total-time', function getTotalTimeToken (req, res, digits) {
  if (!req._startAt || !res._startAt) {
    // missing request and/or response start time
    return
  }

  // time elapsed from request start
  var elapsed = process.hrtime(req._startAt)

  // cover to milliseconds
  var ms = (elapsed[0] * 1e3) + (elapsed[1] * 1e-6)

  // return truncated value
  return ms.toFixed(digits === undefined ? 3 : digits)
});

// Colorized version of:
// app.use(morgan(':date[iso] HTTP/:http-version :method :url -> :status :res[content-length]b - :response-time[2] ms start - :total-time[2] ms tot'));

module.exports = {
    middleware: morgan(function (token, req, res) {
        const t = function (what) {
            return token[what].bind(this, req, res);
        };
        let size = t('res')('content-length');
        if (size) size = size < 1024 ? `${size} B` : `${Math.floor(size / 1024)} Kb`;
        else size = 'N/A';
        return `${c.gray(t('date')('iso'))} ${t('method')().padStart(5, ' ')} ${t('url')().padStart(40, ' ')} -> ${colorStatus(t('status')())} ${c.gray(`${size} - Lat: `.padStart(16, ' '))} ${formatLatency(t('response-time')(2))} ${c.gray(`- Tot: `)} ${formatTotalTime(t('total-time')(2))}`;
    })
};