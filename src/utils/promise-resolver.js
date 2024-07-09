export const promiseResolver = async (cb) => {
  if (typeof cb === "function") {
    const result = cb();
    return promiseResolver(result);
  } else if (cb instanceof Promise) {
    return cb.then((result) => promiseResolver(result));
  } else {
    return Promise.resolve(cb);
  }
};
