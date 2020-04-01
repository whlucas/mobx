import { Component, Fragment } from "react";
import { observer } from 'mobx-react'
import React from "react";
import { Store } from "../App";
import { trace } from "mobx";
interface ITodoFooterProps {
    store: Store,
}


@observer
class TodoFooter extends Component<ITodoFooterProps> {
    render() {
        trace()
        const store = this.props.store
        return (
            <footer>
                {store.left} item(s) unfinished
            </footer>
        )
    }
}

export default TodoFooter