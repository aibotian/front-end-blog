### promise实现

>首先回顾一下promise基本使用
```javascript 1.6
let promise = new Promise((resolve, reject) => {
    resolve("success")
    // reject("fail")
})
promise.then(res => {
    console.log(res)
})
```

promise的特点以及用法

1. 三个状态（pending、resolved、resolved），状态只能更改一次
2. 构造函数里传一个函数函数的两个参数（resolve, reject）
3. resolve成功时执行的回调
4. reject失败时执行的回调
5. then的使用
6. 异步
7. then的链式调用
8. 值穿透调用
9. catch
10. promise.all
11. promise.race
12. Promise.resolve
13. Promise.reject

下面我们实现Promise类，如果对es6类class用法不明白的请移步3.1 [es6中class源码解析](./js/class.md)

1. 先来模拟第1、2、3、4点，完成promise实例化声明过程中状态的改变
```javascript 1.6
class Promise {
    constructor(executor) {
        this.status = "pending"; // 默认promise状态
        this.value;  // resolve成功时的值
        this.reason;  // reject失败时的值

        let resolve = value => {
            if(this.status === "pending") {
                this.value = value;
                this.status = "resolved";
            }
        }

        let reject = value => {
            if(this.status === "pending") {
                this.reason = value;
                this.status = "rejected";
            }
        }

        executor(resolve, reject)
    }
}
var promise = new Promise((resolve, reject) => {
    resolve("success")
})
````

2.模拟第5点，then的使用

```javascript 1.6
class Promise {
        constructor(executor) {
            this.status = "pending"; // 默认promise状态
            this.value;  // resolve成功时的值
            this.reason;  // reject失败时的值

            let resolve = value => {
                if(this.status === "pending") {
                    this.value = value;
                    this.status = "resolved";
                }
            }

            let reject = value => {
                if(this.status === "pending") {
                    this.reason = value;
                    this.status = "rejected";
                }
            }

            executor(resolve, reject)
        }

        then(onFullfilled, onRejected) {
            if(this.status === "resolved") {
                onFullfilled(this.value)
            }
            if(this.status === "rejected") {
                onRejected(this.reason)
            }
        }
    }

    var promise = new Promise((resolve, reject) => {
        resolve("success");
        // reject("fail")
    })
    promise.then(res => {
        console.log(res)
    }, err => {
        console.log(err)
    })
````
通过上面代码执行，打印出success

3.异步

上面的代码实际上没有去考虑异步的问题
```javascript 1.6
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("success")
    }, 1000);
})
promise.then(res => {
    console.log(res)
})
````
执行这段代码发现打印不出来success了，因为我们的then在主执行栈中发现```status === "pending"```立刻就执行完了，加上对异步的处理

```javascript 1.6
class Promise {
        constructor(executor) {
            this.status = "pending"; // 默认promise状态
            this.value;  // resolve成功时的值
            this.reason;  // reject失败时的值
            this.resolveQueue = []; // 成功时回调队列
            this.rejectQueue = []; // 失败时回调队列

            let resolve = value => {
                if(this.status === "pending") {
                    this.value = value;
                    this.status = "resolved";
                    this.resolveQueue.forEach(fn => fn())
                }
            }

            let reject = value => {
                if(this.status === "pending") {
                    this.reason = value;
                    this.status = "rejected";
                }
                this.rejectQueue.forEach(fn => fn())
            }

            executor(resolve, reject)
        }
        
        then(onFullfilled, onRejected) {
            if(this.status === "resolved") {
                this.resolveQueue.push(() => {
                    onFullfilled(this.value)
                })
            }
            if(this.status === "rejected") {
                this.rejectQueue.push(() => {
                    onRejected(this.reason)
                })
            }
            if(this.status === "pending") {
                this.resolveQueue.push(() => {
                    onFullfilled(this.value)
                })
                this.rejectQueue.push(() => {
                    onRejected(this.reason)
                })
            }
        }
    }

    var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("success")
        }, 1000);
    })
    promise.then(res => {
        console.log(res)
    }, err => {
        console.log(err)
    })
````
至此解决了异步问题,给状态为resolved、rejected的resolve、reject回调函数添加了回调队列。


首先说明的是promise完成链式调用使用的是递归，不完全是返回this的方式。
如果对返回this方式有疑问请看上一章节3.2 [promise前世今生](./js/promise-pre.md)


既然不返回this，那么then函数中至少应该返回一个promise的实例。

4. 链式调用

```javascript 1.6
/**
 * 处理promise递归的函数
 *
 * promiseRef {Promise} promise实例
 * result {*} promise回调函数处理的结果
 * resolve {function} 成功回调
 * reject {function} 失败回调
 */
function handlePromise(promiseRef, result, resolve, reject) {
    if(promiseRef === result) { // promise resolve（）中的参数如果是本身就无限循环了
        return reject(new TypeError("circle refrence"))
    }
    // 递归条件
    if(result !== null &&(typeof result === "object" || typeof result === "function")) {
        let called; // promise状态只能更改一次
        try {
            let then = result.then;
            if(typeof then === "function") { // result是promise对象
                then.call(result, param => {
                    if(called) return
                    called = true;
                    handlePromise(promiseRef, param, resolve, reject) // 递归解析promise
                }, err => {
                    if(called) return;
                    called = true;
                    reject(err);
                })
            } else { // reuslt只是普通js对象
                resolve(result)
            }

        }catch(e) {
            if(called) return;
            called = true;
            reject(e);
        }

    } else { // 基本类型
        resolve(result)
    }
}
class Promise {
    constructor(executor) {
        this.status = "pending"; // 默认promise状态
        this.value;  // resolve成功时的值
        this.reason;  // reject失败时的值
        this.resolveQueue = []; // 成功时回调队列
        this.rejectQueue = []; // 失败时回调队列

        let resolve = value => {
            if(this.status === "pending") {
                this.value = value;
                this.status = "resolved";
                this.resolveQueue.forEach(fn => fn())
            }
        }

        let reject = value => {
            if(this.status === "pending") {
                this.reason = value;
                this.status = "rejected";
                this.rejectQueue.forEach(fn => fn())
            }
        }

        executor(resolve, reject)
    }

    then(onFullfilled, onRejected) {
        let promiseRef;
        if(this.status === "resolved") {
            promiseRef = new Promise((resolve, reject) => {
                let result = onFullfilled(this.value);
                handlePromise(promiseRef, result, resolve, reject);
            })
        }
        if(this.status === "rejected") {
            promiseRef = new Promise((resolve, reject) => {
                let result = onRejected(this.value);
                handlePromise(promiseRef, result, resolve, reject);
            })
        }
        if(this.status === "pending") {
            promiseRef = new Promise((resolve, reject) => {
                this.resolveQueue.push(() => {
                    let result = onFullfilled(this.value);
                    handlePromise(promiseRef, result, resolve, reject);
                })
                this.rejectQueue.push(() => {
                    let result = onRejected(this.reason);
                    handlePromise(promiseRef, result, resolve, reject);
                })
            })
        }


        return promiseRef;
    }
}
// test1
var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("success")
    }, 1000);
})
promise.then(res => {
    console.log(res)
}, err => {
    console.log(err)
})
// test2
var promise = new Promise((resolve, reject) => {
    resolve();
})
promise.then((res)=>{
    return new Promise((resolve,reject)=>{ //返回一个新的Promise
        resolve('hello world');
    })
},(err)=>{
    console.log(err);
}).then((res)=>{
    console.log(res); //hello world
},(err)=>{
    console.log(err);
})
```

5.值穿透

```javascript
let promise = new Promise((resolve, reject)=>{
    resolve(123);
})
promise.then().then().then((res)=>{ 
    console.log(res);
})
````

我们希望可以正常打印出123,其实很简单，只要我们替换掉onFullFilled函数
和onRejected函数
```javascript 1.6
then(onFulfilled, onRejected) { 
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : y => y; 
    onRejected = typeof onRejected === 'function' ? onRejected : err => { 
        throw err; 
    }
}
````

6. catch
catch只有失败的回调，相当于```this.then(null,onRejected)```,另外其他几个执行函数的地方都需要注意捕获异常,本次添加异步执行

```javascript 1.6
 /**
     * 处理promise递归的函数
     *
     * promiseRef {Promise} promise实例
     * result {*} promise回调函数处理的结果
     * resolve {function} 成功回调
     * reject {function} 失败回调
     */
    function handlePromise(promiseRef, result, resolve, reject) {
        if(promiseRef === result) { // promise resolve（）中的参数如果是本身就无限循环了
            return reject(new TypeError("circle refrence"))
        }
        // 递归条件
        if(result !== null &&(typeof result === "object" || typeof result === "function")) {
            let called; // promise状态只能更改一次
            try {
                let then = result.then;
                if(typeof then === "function") { // result是promise对象
                    then.call(result, param => {
                        if(called) return
                        called = true;
                        handlePromise(promiseRef, param, resolve, reject) // 递归解析promise
                    }, err => {
                        if(called) return;
                        called = true;
                        reject(err);
                    })
                } else { // reuslt只是普通js对象
                    resolve(result)
                }

            }catch(e) {
                if(called) return;
                called = true;
                reject(e);
            }

        } else { // 基本类型
            resolve(result)
        }
    }
    class Promise {
        constructor(executor) {
            this.status = "pending"; // 默认promise状态
            this.value;  // resolve成功时的值
            this.reason;  // reject失败时的值
            this.resolveQueue = []; // 成功时回调队列
            this.rejectQueue = []; // 失败时回调队列

            let resolve = value => {
                if(this.status === "pending") {
                    this.value = value;
                    this.status = "resolved";
                    this.resolveQueue.forEach(fn => fn())
                }
            }

            let reject = value => {
                if(this.status === "pending") {
                    this.reason = value;
                    this.status = "rejected";
                    this.rejectQueue.forEach(fn => fn())
                }
            }
            try {
                executor(resolve, reject)
            }catch(err) {
                reject(err)
            }
        }

        then(onFullfilled, onRejected) {
            onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : y => y;
            onRejected = typeof onRejected === 'function' ? onRejected : err => {
                throw err;
            }
            let promiseRef;
            if(this.status === "resolved") {
                promiseRef = new Promise((resolve, reject) => {
                        setTimeout(() => { //异步处理
                            try {
                                let result = onFullfilled(this.value);
                                handlePromise(promiseRef, result, resolve, reject);
                            } catch (err) {
                                reject(err)
                            }
                        })
                })
            }
            if(this.status === "rejected") {
                promiseRef = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        try{
                            let result = onRejected(this.value);
                            handlePromise(promiseRef, result, resolve, reject);
                        }catch(err) {
                            reject(err)
                        }
                    })
                })
            }
            if(this.status === "pending") {
                promiseRef = new Promise((resolve, reject) => {
                    this.resolveQueue.push(() => {
                        setTimeout(() => {
                            try {
                                let result = onFullfilled(this.value);
                                handlePromise(promiseRef, result, resolve, reject);
                            }catch(err) {
                                reject(err)
                            }
                        })
                    })
                    this.rejectQueue.push(() => {
                        setTimeout(() => {
                            try{
                                let result = onRejected(this.reason);
                                handlePromise(promiseRef, result, resolve, reject);
                            }catch(err) {
                                reject(err)
                            }
                        })
                    })
                })
            }
            return promiseRef;
        }
        catch(onRejected) {
            return this.then(null, onRejected)
        }
    }
    // test1
    var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("success")
        }, 1000);
    })
    promise.then(res => {
        console.log(res)
    }, err => {
        console.log(err)
    })
```

6. Promise.all

```javascript 1.6
Promise.all = function(array) {
        return new Promise((resolve, reject) => {
            let arr = []
            let i =0;
            function handlePromiseQueue(index, result) {
                arr[index] = result;
                i++;
                if(i === array.length) {
                    resolve()
                }
            }
            for(let i = 0;i < array.length;i++) {
                array[i].then(res => {
                    handlePromiseQueue(i, res);
                }, reject)
            }
        })
    }
````

7. Promise.race

```javascript
Promise.race = function(array) {
    return new Promise((resolve, reject) => {
        for(let i = 0; i<array.length;i++) {
            array[i].then(resolve,reject)
        }
    })
}
````

8. Promise.resolve
```javascript
Promise.resolve = function (val) {
    return new Promise((resolve, reject) => resolve(val));
}
````

9. Promise.reject
```javascript
Promise.reject = function (val) {
    return new Promise((resolve, reject) => reject(val));
}
````

10. PromiseA+规范
```javascript
Promise.deferred = Promise.defer = function () { //这是promise的语法糖
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}
````

好了写到这里，后续会补上测试框架






