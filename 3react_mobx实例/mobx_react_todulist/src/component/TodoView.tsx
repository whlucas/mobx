import { Component, Fragment } from "react";
import { observer } from 'mobx-react'
import React from "react";
import { Store } from "../App";
import { trace } from "mobx";
import TodoItem from "./TodoItem";
interface ITodoViewProps {
    store: Store,
}


@observer
class TodoView extends Component<ITodoViewProps> {
    render() {
        trace()
        const store = this.props.store
        const todos = store.todos
        return todos.map(todo => {
            return <li className="todo-item" key={todo.id}>
                {/* 我们用一个新的组件来显示每一个todo */}
                <TodoItem todo={todo} />
                {/* 删除按钮 */}
                <span
                    className="delete"
                    onClick={() => {
                        store.removeTodo(todo)
                    }}>
                    X
                            </span>
            </li>
        })
    }
}

export default TodoView