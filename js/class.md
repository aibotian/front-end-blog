
## Class

用过react的朋友相信你对下面一段代码很熟悉
```javascript 1.6
class App extends React.Component {
    constructor(props) {
        super(props);
        // ...
    }
    
    render() {
        return (<div />)
    }
}
```
平时经常用类这个名词来交流，那它的本质是什么呢？一起来看看它和es3中我们使用的普通函数对比



1. 声明方式
```javascript
// es6写法
class A {
    // ...
}

// 普通函数写法
function A() {
    // ...
}

// 测试上面两段代码
var a = new A();
console.log(typeof A) // "function"
console.log(A === A.prototype.constructor) // true
console.log(a.__proto === A.prototype) // true
```
通过以上对比，发现class声明的类具有构造函数的特点，或者说它是函数的一个语法糖


2. 原型对象

```javascript
class MathHandle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        add() {
            return this.x + this.y;
        }
    }
    const mh = new MathHandle(2, 3);
    console.log(mh.add())
```
```javascript
function MathHandle(x, y) {
    this.x = x;
    this.y = y;
}

MathHandle.prototype.add = function() {
    return this.x + this.y;
}

var mh = new MathHandle(2, 3);
console.log(mh.add())
```
以上两段代码，可以发现类MathHandle中的函数add，其实就是构造函数原型对象的扩展

3. 继承
```javascript 1.6
class Animal {
    constructor(name) {
        this.name = name;
    }
    eat() {
        console.log(`${this.name} eat`)
    }
}
class Dog extends Animal {
    constructor(name) {
        super(name);
        this.name = name;
    }

    bark() {
        console.log(`${this.name} bark`)
    }
}
var husky = new Dog("哈士奇");
husky.bark();
husky.eat();
```
```javascript
function Animal(name) {
    this.name = name;
    this.eat = function () {
        console.log(`${this.name} eat`)
    }
}
function Dog(name) {
    Animal.call(this, name)
    this.name = name;
    this.bark = function() {
        console.log(`${this.name} bark`)
    }
}
function F() {}
F.prototype = Animal.prototype;
Dog.prototype = new F();
Dog.prototype.constructor = Dog;
// 多加一行隐式原型指向、这行和写继承代码无关
Dog.__proto__ = Animal
var husky = new Dog("哈士奇");
husky.bark();
husky.eat();
```

通过以上对比，发现es6实现继承必须要有两个关键字```extends、super```,值得注意的是使用了extends就必须使用super关键字，普通函数我们使用寄生组合式继承的方式实现继承达到的效果相同，这里实现继承只用了寄生组合式继承，之后我会补上关于继承和原型的文章...

我们看一下```extends、super```关键字分别起了什么作用


找到编译后es6转为es3的代码
```javascript 1.6
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animal = function () {
    function Animal(name) {
        _classCallCheck(this, Animal);

        this.name = name;
    }

    _createClass(Animal, [{
        key: "eat",
        value: function eat() {
            console.log(this.name + " eat");
        }
    }]);

    return Animal;
}();

var Dog = function (_Animal) {
    _inherits(Dog, _Animal);

    function Dog(name) {
        _classCallCheck(this, Dog);

        var _this = _possibleConstructorReturn(this, (Dog.__proto__ || Object.getPrototypeOf(Dog)).call(this, name));

        _this.name = name;
        return _this;
    }

    _createClass(Dog, [{
        key: "bark",
        value: function bark() {
            console.log(this.name + " bark");
        }
    }]);

    return Dog;
}(Animal);
```
我们对号入座，找到对应代码并格式化

extends实现
```javascript 1.6
// extends执行代码
_inherits(Dog, _Animal);
// extends编译代码
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
```
这段代码只是实现了原型链的继承

super实现
```javascript 1.6
// super执行代码
var _this = _possibleConstructorReturn(this, (Dog.__proto__ || Object.getPrototypeOf(Dog)).call(this, name));
// super编译代码
function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}
```
经过extends执行Object.setPrototypeOf(Dog, Animal)相当于Dog.__proto__ = Animal之后这里的代码就好理解了,_possibleConstructorReturn执行就相当于Animal.call(this, name)使用了构造函数的方式实现继承
这下就知道使用extends继承为什么一定要super了吧

实例对象和构造函数的扩展实现
```javascript 1.6
// 实例对象和构造函数的扩展的执行代码
_createClass(Dog, [{
    key: "bark",
    value: function bark() {
        console.log(this.name + " bark");
    }
}]);
// 实例对象和构造函数的扩展的编译代码
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();
```
嗯哼、原型对象的扩展方法就是组装好属性描述符descriptor,用defineProperties方法去定义Constructor.prototype的属性，如果对这段不熟悉大家可以去看看es5代码，也可以和es3prototype原型对象的扩展对比一下


再说两句es7提案中有静态属性和实例属性也是用```实例对象和构造函数的扩展```这段代码来实现的，注意上面倒数第二行```if (staticProps) defineProperties(Constructor, staticProps);```

再简单介绍下静态属性和实例属性的写法，就不在编译代码了

```javascript 1.6
    class App extends React.Component {
        // 实例属性
        state = { props1: ""}
        // 静态属性
        static props2 = true
        
        constructor(props) { super(props) }
    }

```

