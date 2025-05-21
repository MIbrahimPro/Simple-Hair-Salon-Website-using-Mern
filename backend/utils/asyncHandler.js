// simple wrapper to catch async errors and pass to errorHandler
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
