import { observable, action } from 'mobx'

export default class Todo {
    id: number = Math.random()

    @observable
    title: string

    @observable
    finished: boolean = false

    constructor (title: string) {
        this.title = title
    }

    // 在这个里面去定义修改它的属性的action
    @action.bound
    toggle() {
        this.finished = !this.finished
    }
}