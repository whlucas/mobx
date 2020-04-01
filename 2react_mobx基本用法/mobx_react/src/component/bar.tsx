import { Component } from 'react';
import React from 'react';
import { observer } from 'mobx-react';

interface IBarProps {
    queue: any[]
}

// 这个从mobx-react引入的observer是用来修饰react类本身的
// 而不是用来修饰class中的类成员的
// 他的作用是把这个类组件的render变成一个autorun的函数,当里面的被观察的属性修改了,就进行重渲染
// 但是这里我们给这个Foo组件加上这个发现不好使,只有给bar组件加上好使
// 因为Foo组件里面没有直接用到改变了的queue属性,而bar用到了
// 但都写上这个没有副作用,不写反而会导致有些情况不更新的bug
@observer
class Bar extends Component<IBarProps> {
    render() {
        const queue = this.props.queue
        return <span>{queue.length}</span>
    }
}

export default Bar