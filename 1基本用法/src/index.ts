import { observable, isArrayLike, extendObservable, computed, autorun, when, reaction, action, runInAction } from 'mobx'
// 实现类的继承
// 这种写法在ts里是有问题的,所以注释了
// function Animal() {}
// function Dog() {}
// Dog.prototype = Object.create(Animal.prototype,{
//     constructor: {
//         // 这里还要把他自己的constructor指向自己
//         value: Dog,
//         // 他不可枚举
//         enumerable: false
//     }
// });
// new Dog() instanceof Animal


// class Animal {
//     area: string = '11'
//     name() {
//         console.log(this.area)
//     }
// }
// const animal = new Animal()
// console.log(animal.name)



// 开始!


// observable
// 他也可以作为装饰器来使用
const arr = observable(['a', 'b'])

// 处理之后他就不是array了
console.log(Array.isArray(arr))

// 这个函数用来判断是不是转化后的类型
console.log(isArrayLike(arr))

// 虽然不是array,但他还具有array的基本功能
console.log(arr[0], arr.pop(), arr.push('b'))

// 但访问越界的数组,比如去访问arr[2],就会出警告,他不会被监视


// 对象
const obj = observable({a: 1, b: 2})

// 转化完能正常访问
console.log(obj.a)

// 他只能对已有的属性进行监视
// 如果要监视新加的属性了
// extendObservable()

// 但是最佳实践就是一开始监视所有的属性


// Map
const map = observable(new Map())

// 他也可以调用Map的常用方法
map.set('a', 1)
console.log(map.has('a'))

map.delete('a')


// 对于number, string, boolean
// 用observable.box()

let num = observable.box(20);
let str = observable.box('hello');
let bool = observable.box(true);

// 这个get就是获得他原来的类型值
console.log(num.get())

// 这个set是修改他的原始类型值
num.set(50)



// 用装饰器来修饰class中的属性,使他们可被监视

class Store {
    @observable
    array: number[] = []

    @observable
    obj: Object = {}

    @observable
    map: Object = new Map()


    // 会发现不管是基础类型还是对象数组都是用@observable来声明的
    @observable
    string: string = 'hello'

    @observable
    num: number = 11

    @observable
    bool: boolean = false
}


// computed
// 他可以作为装饰器来使用
// 利用可观察数据计算出一个新的属性
// 他可以嵌套引用其他computed的值,但不能循环引用

const store = new Store();
// 给computed传一个没有参数的函数
const foo = computed(() => {
    return store.string + '/' + store.num;
})

// 这个foo就是一个可观察的计算出来的值
// 这个可以获得计算出来的值显示值
foo.get()

// 我在这个生成的新的值上调用observe方法来监听他
// 传进来的change对象可以看到变化
foo.observe((change) => {
    console.log(change)
})

// 当我修改store.string 和 store.number的时候
// 就能通过foo.observe来看到foo的变化
store.string = 'world' 

class Store1 {
    @observable
    string: string = 'hello'

    @observable
    num: number = 11

    @observable
    bool: boolean = false

    // computed 用作装饰器
    @computed get mixed() {
        return store1.string + '/' + store1.num
    }

    // 我在这个里面多次赋值
    @action
    bar () {
        store.string = 'lalala'
        store.string = 'lalala'
        store.string = 'lalala'
    }

    @action.bound
    bar1() {
        store.string = 'lalala'
        store.string = 'lalala'
        store.string = 'lalala'
    }
}

const store1 = new Store1()
// autorun
// 在可观察数据修改之后自动执行和他有关的行为,具体行为就是往里面传函数
// 当我autorun里面引入的任意可观察数据,这个auto里面的函数就会被执行一次
// 他可以用作对副作用的自动处理
// 但如果经常执行这个函数也会浪费计算资源,后面会讲怎么办
autorun(() => {
    console.log(store1.string + '/' + store1.num);
    // 我在这里写store1.mixed,对string和num改变也会出发这个函数
    console.log(store1.mixed)
})

store.string = 'lalala' // 这样auto就执行了


// when
// 上面的autorun只要其中一个变了就执行了,太宽泛了
// 这个可以指定条件
// 接收两个函数参数第一个函数依据可观察数据返回一个bool值,如果是true,就去执行第二个函数,并且保证只执行一次

// 注意如果第一个函数一开始就返回true,那么第二个函数就会同步立即执行

when(() => store1.bool, () => {
    console.log("it's true")
})

store1.bool = true // 这样就会执行when的第二个函数


// reaction
// 无论观察的数据变不变,这个when的第一个函数都要先执行一次
// 因为他不知道那些数据被引用了,他需要执行一次去知道之后要监听哪一个东西的变动
// 所以我们主动告知他我引用了哪些数据的话,他就可以避免这种函数的执行了

// 他接收两个函数类型的参数
// 第一个引用可观察数据,返回一个值,这个值会作为第二个函数的参数
reaction(() => {
    return [store1.string, store1.num]
}, arr => {
    console.log(arr.join('/'))
})

store.string = 'haohaohao'

// 在初始化的时候第一个函数会被先执行一次,这样他就知道那些被引用了,需要观察他
// 然后当观察的数据被修改后就会执行第二个函数
// 他分离了可观察数据的申明,这样不会执行副作用,就可以实现函数的执行

// 应用场景,当数据第一次被填充的时候,使用这个函数来写入数据



// action
// 他可以作为装饰器来使用
// 直接对变量进行赋值会造成reaction 或者 autorun的执行
// 太过平凡消耗性能
// 他被定义为很合修改状态的行为
// 它能够将多次修改状态的行为合并成一次,从而减少观察函数执行的次数

// 当我写了reaction的时候
// 去调用
store1.bar();
// reaction也只会被执行一次


// action.bound
// 如果我是用action.bound修饰
// 这种方式适合给函数传递callback
// 那调用的时候就是
const bar = store1.bar1
bar()


// runInAction
// 需要复用的话用action,否则直接runInAction
// 可以随时定义匿名的action并执行他
// 第一个参数是给他一个key值,方便调试,可以不传
// 第二个传一个函数,里面去改变想要改变的东西
runInAction('modify', () => {
    store1.string = 'world'
})








