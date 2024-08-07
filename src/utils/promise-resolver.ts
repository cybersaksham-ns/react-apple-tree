export async function promiseResolver(cb: any): Promise<any> {
  if (cb) {
    if (cb instanceof Promise) {
      return cb.then((result) => promiseResolver(result));
    } else if (typeof cb === "function") {
      const result = cb();
      return promiseResolver(result);
    } else {
      return Promise.resolve(cb);
    }
  }
}
