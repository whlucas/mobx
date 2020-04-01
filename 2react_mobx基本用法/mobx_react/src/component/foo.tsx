import { Component } from 'react';
import Bar from './bar';
import React from 'react';
import { ICache } from '../App';
import { observer } from 'mobx-react';
// import { observer } from 'mobx-react'

interface IFooProps {
    catch: ICache,
    refresh: () => void
}

// 这个从mobx-react引入的observer是用来修饰react类本身的
// 而不是用来修饰class中的类成员的
// 他的作用是把这个类组件的render变成一个autorun的函数,当里面的被观察的属性修改了,就进行重渲染
// 但是这里我们给这个Foo组件加上这个发现不好使,只有给bar组件加上好使
// 因为Foo组件里面没有直接用到改变了的queue属性,而bar用到了
// 但都写上这个没有副作用,不写反而会导致有些情况不更新的bug
@observer
class Foo extends Component<IFooProps> {
    render() {
        const myCatch = this.props.catch
        return (
            <div>
                {/* 这里写一个button,每点一下就利用传古来的action给store里面的数据加一 */}
                <button onClick={this.props.refresh}>加1</button>
                <Bar queue={myCatch.queue}></Bar>
            </div>
        )
    }
}

export default Foo
