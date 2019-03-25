// Add latency to the request 
// either evenly randomly distributed from opt.delayStartFrom to opt.delayStartTo ms 
// or a constant opt.delayStart ms

module.exports = function (_opt = {}) {
    const delayStartFrom = _opt.delayStartFrom || _opt.delayStart || 0;
    const delayStartTo = _opt.delayStartTo || _opt.delayStart || 0;

    return function (req, res, next) {
        const rnd = Math.random();
        const delayStart = Math.floor(delayStartFrom + (delayStartTo - delayStartFrom) * rnd);

        setTimeout(() => {
            if (res.setMetric) {
                // If server-timing' middleware is present
                res.setMetric('add-latency', delayStart, 'addLatency middleware');
            } else {
                res.append('X-add-latency', delayStart);
            }
            next();
        }, delayStart);
    }
}