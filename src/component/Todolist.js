import React, {Component} from 'react'
import '../assets/css/todolist.css'
// 引用storage模块
import storage from '../model/storage'

export default class Todolist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }

    addData = () => {
        const temp = {
            title: this.refs['title'].value,
            checked: false
        }
        /*
         * 不可以直接 ：
         * this.setState({
            list: this.state.list.push(temp)
            })
         * 因为this.state.list.push(temp)的返回值是这个元素加入到数组后的索引！
         * 也不能直接操作this.state.list，如果要改变state里的list的值
         * 要先获取原来的list，
         * 赋值给新的字段，
         * 再通过this.setState({})来修改
         */
        const list = this.state.list
        list.push(temp)
        this.setState({
            list: list
        })
        // 表单置空
        this.refs['title'].value = ''
        // 使用storage缓存数据，只能存字符串
        storage.set('todolist', list)
    }
    // 一按回车键盘就增加
    addDataByEnter = e => {
        if (e.keyCode === 13) {
            const temp = {
                title: this.refs['title'].value,
                checked: false
            }
            const list = this.state.list
            list.push(temp)
            this.setState({
                list: list
            })
            // 表单置空
            this.refs['title'].value = ''
            // 使用storage缓存数据，只能存字符串
            storage.set('todolist', list)
        }
    }
    removeData = index => {
        const list = this.state.list
        list.splice(index, 1)
        this.setState({
            list: list
        })
        // 使用storage缓存数据，只能存字符串
        storage.set('todolist', list)
    }
    changeChecked = index => {
        const list = this.state.list
        list[index].checked = !list[index].checked
        this.setState({
            list: list
        })
        // 使用storage缓存数据，只能存字符串
        storage.set('todolist', list)
    }
    // 一刷新就加载的生命周期函数
    componentDidMount() {
        // 获取数据，字符串转为JSON
        const list = storage.get('todolist')
        if (list) {
            this.setState({
                list: list
            })
        }
    }
    render() {
        return (
            <div className="todolist">
                <h3>输入代办事项</h3>
                <div className="row1">
                    <input ref="title" onKeyUp={this.addDataByEnter}/>
                    <button onClick={this.addData}>增加+</button>
                </div>
                <h3>您的代办事项</h3>
                <ul>
                    {
                        // 在map内部用到this要注意指向，所以使用箭头函数
                        this.state.list.map((value, key) => {
                            if (!value.checked) {
                                // return里的代码如果想换行，用的是”括号()“来包裹
                                return (
                                    <li key={key}>
                                        <input type="checkbox" checked={value.checked} onChange={this.changeChecked.bind(this, key)}/>
                                        {value.title}
                                        <button onClick={this.removeData.bind(this, key)}>删除-</button>
                                    </li>
                                )
                            }
                            // map里没直接return会有warning
                            return ''
                        })
                    }
                </ul>
                <h3>您的已完成事项</h3>
                <ul>
                    {
                        // 在map内部用到this要注意指向，所以使用箭头函数
                        this.state.list.map((value, key) => {
                            if (value.checked) {
                                // return里的代码如果想换行，用的是“括号()”来包裹
                                return (
                                    <li key={key}>
                                        <input type="checkbox" checked={value.checked} onChange={this.changeChecked.bind(this, key)}/>
                                        {value.title}
                                        <button onClick={this.removeData.bind(this, key)}>删除-</button>
                                    </li>
                                )
                            }
                            // map里没直接return会有warning
                            return ''
                        })
                    }
                </ul>
            </div>
        )
    }
}
