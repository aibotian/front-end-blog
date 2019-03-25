## 关于promise

promise解决了异步、回调地狱、链式调用等问题那我们一起来分析一下promise的使用场景

------

### 回调地狱


我们知道加载图片是异步的，那么我们写个加载图片的demo
```javascript 1.6
var src="https://www.baidu.com/img/bd_logo1.png"
function loadImg (src, callback, fail) {
    var img = document.createElement("img");
    img.onload = function() {
        callback(img);
    }
    img.onerror = function() {
        fail();
    }
    img.src = src;
}
loadImg(src, function(img) {
    console.log(img.width)
},function() {
    console.log("load fail")
})
```

不错，加载完图片打印出了宽度，现在我们又加需求了，要求出高度，按照以往填坑经验可能会写出这样的代码

```javascript 1.6
var src="https://www.baidu.com/img/bd_logo1.png"
function loadImg (src, callback, fail) {
    var img = document.createElement("img");
    img.onload = function() {
        callback(img, getHeight);
    }
    img.onerror = function() {
        fail();
    }
    img.src = src;
}
function getHeight(img) {
    console.log(img.height);
}
loadImg(src, function(img, callback) {
    console.log(img.width);
    // 方式1
    // (function(img1){ console.log(img1.height) })(img);
    // 方式2
    callback(img);
},function() {
    console.log("load fail")
})
```

毫不夸张的说，回调地狱已成雏形版本，之后随着需求的不断增加一个公司的人前仆后继就形成地狱了...
扯远了，那么我们es6改掉这种做法，用promise改造一下

```javascript 1.6
var src="https://www.baidu.com/img/bd_logo1.png"
function loadImg(src) {
    const promise  = new Promise((resolve, reject) => {
        var img = document.createElement("img");
        img.onload = function() {
            resolve(img);
        }
        img.onerror = function() {
            reject();
        }
        img.src=src;
    })
    return promise;
}
const promise = loadImg(src);
promise.then(img => {
    console.log(img.width)
})
promise.then(img => {
    console.log(img.height)
})
// 或者
// loadImg(src).then(img => {
//     console.log(img.width)
// }).then(img => {
//     console.log(img.height)
// })
```


### 链式调用

上面注释的代码是链式调用的，关于链式调用jquery时期我们是这么做的返回this,这里只做了个简易版的供大家参考

```javascript 1.6
const Jquery = $ = function(selector) {
    var dom = document.querySelector(selector)
    dom.__proto__ = Object.assign(dom.__proto__, temp);
    return dom;
}
var temp = $.prototype;
$.prototype.css = function(props, value) {
    this.style[props] = value;
    return this;
}
$.prototype.html = function(html) {
    this.innerHTML = html;
    return this;
}
$.prototype.on = function(type, callback, pipe = false) {
    this.addEventListener(type, callback, pipe)
    return this;
}
$("#app").css("backgroundColor", "#f00").html("12345").on("click", function(e){
    console.log(e)
}).on("mousemove", function(e) {
    console.log(e)
})
```

到这里我们也了解链式调用了，其实promise的链式调用使用的并不是这种方式，而是函数式编程的思想

### 函数式编程

这里简单介绍下函数式编程，先来分析两个小demo

>实现个函数先加5，再乘以10

看到这里so easy 分分钟实现

```javascript 1.6
    function calc1(x) {
        return (x + 5) * 10;
    }
    calc(x);
```

> 需求升级，再写个函数先乘以10，再加上5

so easy 凭我的手速一分钟写上个十个八个这样的函数没有问题

```javascript 1.6
    function calc2(x) {
        return x * 10 + 5;
    }
    calc(x);
```

分析这两段代码，其实是有公共代码的我们可以把它们提取出来，利用函数组合的方式

```javascript 1.6
    function add5 = x => x + 5;
    function multi10 = y => y * 10;
    var compose = (func1, func2) => x => func1(func2(x))
    console.log(compose(add5, multi10)(1))
    console.log(compose(multi10, add5)(1))
```
看起来并不怎么样，甚至开始鄙视这种写法，并没有觉得怎么好？

>继续升级需求，求一个数x运算后的结果  
1).  ((x+5) * 10)+5  
2).  (((x+5) * 10)+5) * 10  
3).  (((x+5) * 10)+5) * 10 + 5  
4).  ((((x+5) * 10)+5) *10 + 5) * 10  
5).  ((((x+5) * 10)+5) *10 + 5) * 10  + 5

经过上面五个题目分分钟打死产品，是不是又要写五个函数？

看下正解，利用函数组合的方式
```javascript 1.6
var add5 = function (x) { return x+5 }
var multi10 = function(y) { return y*10 }
var compose = function (...funcs) {
    if (funcs.length === 0) {
        return arg => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
console.log(compose(add5, multi10, add5)(1))
console.log(compose(multi10, add5, multi10,add5)(1))
console.log(compose(add5, multi10, add5, multi10, add5)(1))
console.log(compose(multi10, add5, multi10, add5, multi10, add5)(1))
console.log(compose(add5, multi10, add5, multi10, add5, multi10, add5)(1))
````

也许还是觉得函数式编程不怎么样，但你发现了没有我只有两个功能在里面一个是乘以10，一个是加上5，随着需求不断增加，好处也就体现出来了


最后说一道关于柯里化的面试题目，求

add(1)(2)(3)  
add(1)(2)(3)(4)  
add(1)(2)(3)(4)(5)  
add(1)(2)(3)(4)(5)(6)  
add(1)(2)(3)(4)(5)(6)(7)  
add(1)(2)(3)(4)(5)(6)(7) ...(n)  
分分钟打死面试官？

```javascript 1.6
function add () {
    var args = [].slice.call(arguments);

    var fn = function () {
        var arg_fn = [].slice.call(arguments);
        return add.apply(null, args.concat(arg_fn));
    }

    fn.valueOf = function() {
        return args.reduce((a, b) => a + b);
    }
    return fn;
}
````

好了大家自行去运行，说了这么多其实是在为写promise做个铺垫

