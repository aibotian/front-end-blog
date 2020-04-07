function Promise(executor) {
  this.status = "pending";

  this.value;
  this.reason;
  this.fullfilledArray = [];
  this.rejectedArray = [];

  const resolve = value => {
    if (this.status === "pending") {
      this.status = "resolved";
      this.value = value;
      this.fullfilledArray.forEach(fn => fn());
    }
  };

  const reject = reason => {
    if (this.status === "pending") {
      this.status = "rejected";
      this.reason = reason;
      this.rejectedArray.forEach(fn => fn());
    }
  };

  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

Promise.prototype.then = function(fullfilled, rejected) {
  this.onFullfilledFunc =
    typeof fullfilled === "function" ? fullfilled : data => data;
  this.onRejectedFunc =
    typeof rejected === "function"
      ? rejected
      : error => {
          throw error;
        };
  let promise2;
  if (this.status === "resolved") {
    return (promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var result = this.onFullfilledFunc(this.value);
          resolvePromise(promise2, result, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }

  if (this.status === "rejected") {
    return (promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          var result = this.onRejectedFunc(this.reason);
          resolvePromise(promise2, result, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }));
  }

  if (this.status === "pending") {
    return (promise2 = new Promise((resolve, reject) => {
      try {
        this.fullfilledArray.push(() => {
          setTimeout(() => {
            try {
              let result = this.onFullfilledFunc(this.value);
              resolvePromise(promise2, result, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.rejectedArray.push(() => {
          setTimeout(() => {
            try {
              let result = this.onRejectedFunc(this.reason);
              resolvePromise(promise2, result, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    }));
  }
};

function resolvePromise(promise2, result, resolve, reject) {
  if (promise2 === result) {
    throw new Error("The error due to circular reference");
  }
  let then;
  let consumed = false;
  if (
    (typeof result === "object" || typeof result === "function") &&
    target !== null
  ) {
    try {
      then = result.then;
      if (typeof then === "function") {
        then.call(
          result,
          y => {
            if (consumed) return;
            consumed = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          e => {
            if (consumed) return;
            consumed = true;
            reject(e);
          }
        );
      } else {
        if (consumed) return;
        consumed = true;
        resolve(error);
      }
    } catch (error) {
      if (consumed) return;
      consumed = true;
      reject(error);
    }
  } else {
    if (consumed) return;
    consumed = true;
    resolve(result);
  }
}

Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

Promise.resolve = function(value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};

Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

Promise.all = function(promiseArray) {
  if (!Array.isArray(promiseArray)) {
    throw new Error("The arguments should be array");
  }
  return new Promise((resolve, reject) => {
    try {
      let resultArray = [];
      let length = promiseArray.length;
      for (let i = 0; i < length; i++) {
        promiseArray[i].then(result => {
          resultArray.push(result);
          if (length === resultArray.length) {
            resolve(resultArray);
          }
        }, reject);
      }
    } catch (error) {
      reject(error);
    }
  });
};
