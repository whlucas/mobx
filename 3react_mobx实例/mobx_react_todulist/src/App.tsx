import React from 'react';
import { observable, action, computed, observe, spy, toJS } from 'mobx'
import Todo from './classes/todo';
import TodoList from './component/TodoList';

// spy
// 监视器,监视所有变化的行为
// observe我只写到了监视属性的熟悉,但是属性的属性的属性就没法整了,不通用
// 这个spy就监视所有
// spy(event => {
//     console.log(event)
// })

export class Store {
    @observable
    todos: Todo[] = []

    // 这是一个储存todos里面的每个成员被观察后的返回函数的组数
    disposers: any[] = []

    constructor() {

        // observe
        // 这是一个监听器,能够监听todos的变化,但不能监听todos里面每一个成员的具体变化
        observe(this.todos, change => {
            // 当我这个容器todos变化的时候我需要让里面的所有监视器都停止监听
            // 重新生成新的一波里面所有成员的监视器
            // 停止监听的方式就是把observe的返回函数执行
            this.disposers.forEach(disposer => disposer())
            // 清空数组
            this.disposers = []
            // 重新生成新的一组监听器并放到容器里面
            for(const todo of change.object) {
                // 监视器的工作就是去打印变化的值
                const disposer = observe(todo, changex => {
                    console.log(changex)
                    // 我们在观察到todos成员发生变化后执行一个save操作
                    this.save()
                })
                this.disposers.push(disposer)
            }
            // 这个打印的是外部数组的变化值
            console.log(change)
            // 在观察到todos发生变化的时候也执行一个save操作
            this.save()
        })
    }

    private save() {
        // toJS
        // 我们在进行存储的时候不希望存储mobx给我们封装后的属性
        // 我希望转化成原来的对象, 用toJS
        console.log(toJS(this.todos))
        localStorage.setItem('todos', JSON.stringify(toJS(this.todos)))
    }


    // 写一个给这个Todu添加的action
    @action.bound
    createTodo(title: string) {
        const todo = new Todo(title)
        this.todos.unshift(todo)
    }

    // 删除todo的action
    @action.bound
    removeTodo(todo: Todo) {
        // 这个remove是mobx给你转化过的数组里面提供的方法,能够方便的找到对应的todo并删除
        (this.todos as any).remove(todo)
    }

    // 实现一个属性用于计算未完成的的todo条目
    // 依赖可观察数据的属性都要用computed,否则依赖这个数据的react组件很可能不会被重新渲染
    @computed
    get left() {
        // 先过滤,再返回过滤后的数组数量
        return this.todos.filter(todo => {
            return !todo.finished
        }).length
    }
}

const store = new Store()

function App() {
    return (
        // 这里传值不要直接引用store的值,把store整个传进去
        <TodoList
            store={store}
        />
    );
}

export default App;
