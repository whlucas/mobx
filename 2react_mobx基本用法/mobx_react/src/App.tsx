import React from 'react';
import Foo from './component/foo'

import { observable, action } from 'mobx'

export interface ICache {
    queue: any[]
}

class Store {
    @observable
    cache: ICache = {
        queue: []
    }

    // 建议把对可观察数据的修改操作都放到action里面
    @action.bound
    refresh() {
        this.cache.queue.push(1)
    }
}

const store = new Store()


// 主要有连个组件
// foo组件被传输的store里面的数据
// foo组件引用了bar组件并且把里面的queue传了进去
function App() {
    return (
        <Foo
            catch={store.cache}
            // 传人对数据的修改函数
            refresh={store.refresh}
        />
    );
}

export default App;
