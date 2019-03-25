function isNumeric(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

// Add latency to the request 
// either evenly randomly distributed from opt.delayStartFrom to opt.delayStartTo ms 
// or a constant opt.delayStart ms

module.exports = function (_opt = {}) {
    const delayStartFrom = _opt.delayStartFrom || _opt.delayStart || 0;
    const delayStartTo = _opt.delayStartTo || _opt.delayStart || 0;

    return function (req, res, next) {
        // If server-timing' middleware is present
        if (res.startTime) {
            res.startTime(('add-latency', 'addLatency middleware');
        }

        const rnd = Math.random();
        const delayStart = Math.floor(delayStartFrom + (delayStartTo - delayStartFrom) * rnd);

        setTimeout(() => {
            if (res.endTime) {
                // If server-timing' middleware is present
                res.endTime('add-latency');
            } else {
                res.append('X-add-latency', delayStart);
            }
            next();
        }, delayStart);
    }
}