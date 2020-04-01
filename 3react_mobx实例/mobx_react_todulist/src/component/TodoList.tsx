import { Component } from "react";
import { observer } from 'mobx-react'
import React from "react";
import { Store } from "../App";

import TodoFooter from "./TodoFooter";
import TodoView from "./TodoView";
import { trace } from "mobx";
import TodoHeader from "./TodoHeader";
interface ITodoListProps {
    store: Store,
}

// 法则一, 改变的属性到组件后面再拿出来,不要提前拿出来 (尽可能晚的结构可观察数据)
// 法则二, 循环遍历的内容单独写一个组件引入 (使用专用组件处理列表)
// 法则三, 尽可能细的拆分视图组件


@observer
class TodoList extends Component<ITodoListProps> {

    render() {
        // trace
        // 这个在副作用中调用,表示追踪,可以看到这个组件何时被重渲染,为什么会重渲染
        // 如果在trace里面加上一个true参数,在冲渲染的时候它就会自动给你进入断点调试
        trace()

        // 先申明一个store
        const store = this.props.store
        // 我遍历的是这里的todo,所以做删除也是在这个里面组件里面删除
        return (
            <div className="todoList">
                {/* 操作区 */}
                {/* 这个imput的value值的改动也会导致整个todoList的重渲染 */}
                {/* 所以也要把他单独放到一个组件里面 */}
                {/* <header>
                    <form action="" onSubmit={this.handleSubmit}>
                        对input进行双向绑定
                        <input type="text" onChange={this.handleChange} value={this.state.inputValue} className="input" placeholder="what needs to be finished"/>
                    </form>
                </header> */}
                <TodoHeader store={store}/>

                {/* 展示区 */}
                <ul>
                    {/* 这里我遍历了todo这个数组,当我这个数组成员改变的时候就会影响到我这里的这个组件重渲染 */}
                    {/* 所以这里也需要一个组件来展示这个,避免todoItem的重渲染来导致我的这个todoItem的重渲染 */}
                    {/* {todos.map(todo => {
                        return <li className="todo-item" key={todo.id}>
                            我们用一个新的组件来显示每一个todo
                            <TodoItem todo={todo}/>
                            删除按钮
                            <span
                                className="delete"
                                onClick={() => {
                                    store.removeTodo(todo)
                                }}>
                                    X
                            </span>
                        </li>
                    })} */}
                    <TodoView store={store}/>
                </ul>


                {/* 提示区 */}
                {/* 直接调用计算属性,由于加了computed装饰器,left变化可导致render更新 */}
                {/* 这里这个left的变化会导致todoList这整个组件的重渲染 */}
                {/* 但实际上这个left的变化仅仅跟todoItem有关,todoItem里面可观察属性的变化不应该导致这个todoList组件的重渲染,所以要把这个组件单独提出去 */}
                {/* <footer>
                    {store.left} item(s) unfinished
                </footer> */}

                {/* 注意这里如果我直接从store里面把left取出来再传进去,当我的这个left变化的时候这个todoList组件还是会重渲染 */}
                {/* 所以要把这个store直接传进去,在todoFooter里面把left取出来使用 */}
                <TodoFooter store={store}/>
            </div>
        )
    }
}

export default TodoList