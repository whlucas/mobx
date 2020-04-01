import { Component, Fragment } from "react";
import { observer } from 'mobx-react'
import React from "react";
import Todo from "../classes/todo";
import { trace } from "mobx";
interface ITodoItemProps {
    todo: Todo,
}


@observer
class TodoItem extends Component<ITodoItemProps> {

    // 注意这里一定要用箭头函数
    private handleClick = () => {
        this.props.todo.toggle()
    }

    render() {
        // trace
        // 这个在副作用中调用,表示追踪,可以看到这个组件何时被重渲染,为什么会重渲染
        // 如果在trace里面加上一个true参数,在冲渲染的时候它就会自动给你进入断点调试
        trace()

        const todo = this.props.todo;
        return (
            <Fragment>
                <input
                    type="checkbox"
                    className="toggle"
                    checked={todo.finished}
                    // 注意这里是onChange事件不是onClick事件
                    onChange={this.handleClick}
                />
                <span className={['title', todo.finished && 'finished'].join(' ')}>{todo.title}</span>
            </Fragment>
        )
    }
}

export default TodoItem