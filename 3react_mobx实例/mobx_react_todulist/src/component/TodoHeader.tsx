import { Component, Fragment } from "react";
import { observer } from 'mobx-react'
import React from "react";
import { Store } from "../App";
import { trace } from "mobx";
interface ITodoHeaderProps {
    store: Store,
}

interface ITodoHeaderStates {
    inputValue: string
}


@observer
class TodoHeader extends Component<ITodoHeaderProps, ITodoHeaderStates> {

    state: ITodoHeaderStates = {
        inputValue: ''
    }

    private handleSubmit = (e: any) => {
        // 阻止页面提交
        e.preventDefault()
        // 取到input的value创建一个todo放到store的todos里面
        // 所以需要用到传来的store里面的action
        const store = this.props.store
        const inputValue = this.state.inputValue
        store.createTodo(inputValue)

        // 清空输入框
        this.setState({
            inputValue: ''
        })
    }

    private handleChange = (e: any) => {
        const inputValue = e.target.value
        // 把他的值存到state里面
        this.setState({
            inputValue
        })
    }

    render() {
        trace()
        return (
            <header>
                <form action="" onSubmit={this.handleSubmit}>
                    {/* 对input进行双向绑定 */}
                    <input type="text" onChange={this.handleChange} value={this.state.inputValue} className="input" placeholder="what needs to be finished" />
                </form>
            </header>
        )
    }
}

export default TodoHeader