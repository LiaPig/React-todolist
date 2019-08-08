## React-todolist

> 用React实现一个todolist

功能参考：(http://www.todolist.cn/)，样式就。。。。你懂的~

![](https://upload-images.jianshu.io/upload_images/7016617-08360c7a8c38c79b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 一、能查看，能新增，能删除

步骤拆分：

1. 初始化页面，应该有输入框`<input ref="title"/>`、增加按钮`<button onClick={this.addData}>增加+</button>`、代办列表`<ul>{ this.state.list.map((value, key) => {return <li key={key}>{value}</li>})}</ul>`、删除按钮`<button onClick={this.removeData.bind(this, key)}>删除-</button>`。

2. 在输入框输入后，当点击增加按钮时(调用`addData方法`)，应拿到此时输入框的值`this.refs['title'].value`，加到代办列表数据里面，代表列表刷新，显示新的数据。

3. 在点击某条代办旁的删除按钮(调用`removeData方法`)，应拿到这条代办的`index`值，在原数组中删掉，代表列表刷新，显示新的数据。

/src/component/Todolist.js ：

```
import React, {Component} from 'react'
import '../assets/css/todolist.css'

export default class Todolist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: ['扫地']
        }
    }

    addData = (e) => {
        const temp = this.refs['title'].value
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
    }
    // 一按回车键盘就增加
    addDataByEnter = e => {
        if (e.keyCode === 13) {
            const temp = this.refs['title'].value
            const list = this.state.list
            list.push(temp)
            this.setState({
                list: list
            })
        }
    }
    removeData = index => {
        const list = this.state.list
        list.splice(index, 1)
        this.setState({
            list: list
        })
    }

    render() {
        return (
            <div className="todolist">
                <div className="row1">
                    <input ref="title" onKeyUp={this.addDataByEnter}/>
                    <button onClick={this.addData}>增加+</button>
                </div>
                <h3>您的代办事项</h3>
                <ul>
                    {
                        // 在map内部用到this要注意指向，所以使用箭头函数
                        this.state.list.map((value, key) => {
                            return <li key={key}>{value}<button onClick={this.removeData.bind(this, key)}>删除-</button></li>
                        })
                    }
                </ul>
            </div>
        )
    }
}
```

简单样式：/src/assets/css/todolist.css

```
.todolist {
    padding: 40px;
}
button {
    margin-left: 20px;
}
li {
    margin-top: 10px;
}
```

![](https://upload-images.jianshu.io/upload_images/7016617-567556c8402566e9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1.初始页面


![](https://upload-images.jianshu.io/upload_images/7016617-dc260011db315e08.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2.输入拖地，点击增加+按钮后


![](https://upload-images.jianshu.io/upload_images/7016617-e79cc8e975e710c4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3.点击扫地代办旁的删除-按钮


![](https://upload-images.jianshu.io/upload_images/7016617-8264eb8daa90672b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3.点击扫地代办旁的删除-按钮后



### 二、新增已完成事项，已完成事项与代办事项能切换

1. 修改`list`的结构

```
// 在步骤一的基础上，要新增个已完成事项
// 那么list里的元素的结构会改变，我们定为对象，title字段表示代表事项名，checked字段表示属于代办(false)或者已完成(true):
this.state = {
    list: [
        {
            title: '扫地',
            checked: false
        },
        {
            title: '遛狗',
            checked: true
        }
    ]
}
```

2.修改两个增加代办方法：一个是点击按钮后（`addData`），一个是enter键（`addDataByEnter`），原来是新增字符串元素，要改为新增对象元素，`title`依旧为输入框的，`checked`为`false`；（这里顺便新增“新增代办后置空输入框”的功能）

```
addData = (e) => {
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
    }
    // 表单置空
    this.refs['title'].value = ''
}
```

3. 删除方法不用修改，依旧是通过`index`来删除

4. 修改代办事项的渲染代码：原来是直接渲染数组中的元素，如今是渲染数组中`checked`为`false`的对象，且在事项名字前加个`checkbox`方便勾选

```
<h3>您的代办事项</h3>
<ul>
{
    // 在map内部用到this要注意指向，所以使用箭头函数
    this.state.list.map((value, key) => {
    if (!value.checked) {
        // return里的代码如果想换行，用的是“括号()”来包裹
        return (
            <li key={key}>
                <input type="checkbox" checked={value.checked}/>
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
```

5.新增已完成事项的渲染代码：copy代办的把判断条件改为`if (value.checked)`

```
<h3>您的已完成事项</h3>
<ul>
{
    // 在map内部用到this要注意指向，所以使用箭头函数
    this.state.list.map((value, key) => {
    if (value.checked) {
        // return里的代码如果想换行，用的是“括号()”来包裹
        return (
            <li key={key}>
                <input type="checkbox" checked={value.checked}/>
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
```

6. 新增已完成事项与代办事项能切换：在`input `中新增`onChange`事件监听，把当前元素的`index`值传给方法，方法里把原数组中的此元素的`checked`值改为`!checked`

完整代码：

```
import React, {Component} from 'react'
import '../assets/css/todolist.css'

export default class Todolist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [
                {
                    title: '扫地',
                    checked: false
                },
                {
                    title: '遛狗',
                    checked: true
                }
            ]
        }
    }

    addData = (e) => {
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
        }
    }
    removeData = index => {
        const list = this.state.list
        list.splice(index, 1)
        this.setState({
            list: list
        })
    }
    changeChecked = index => {
        const list = this.state.list
        list[index].checked = !list[index].checked
        this.setState({
            list: list
        })
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
```
![](https://upload-images.jianshu.io/upload_images/7016617-f0449ee192cf0ccb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1.初始页面


![](https://upload-images.jianshu.io/upload_images/7016617-64b39eda62c02681.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2.输入拖地后按增加+按钮或enter键


![](https://upload-images.jianshu.io/upload_images/7016617-8d25f1502326a4dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3.勾选扫地事项前的checkbox框


![](https://upload-images.jianshu.io/upload_images/7016617-ad2cf78036d9aaab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3.从代办事项移到了已完成事项


![](https://upload-images.jianshu.io/upload_images/7016617-9cf1c3e0de179f56.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4.勾选遛狗事项前的checkbox框


![](https://upload-images.jianshu.io/upload_images/7016617-b41b5d63861f5b18.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
4.从已完成事项移到了代办事项


### 三、使用 Storage 刷新页面后数据不会丢失

1. 清空默认数据
```
this.state = {
    list: []
}
```

2. 删除事项方法、改变代办/已完成事项方法、两个新增代办事项方法：都加入代码`localStorage.setItem('todolist', JSON.stringify(list))`

3. 页面渲染就调用获取`Storage`里的`todolist`数据，赋值给`state.list`：使用生命周期函数`componentDidMount`

```
import React, {Component} from 'react'
import '../assets/css/todolist.css'

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
        localStorage.setItem('todolist', JSON.stringify(list))
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
            localStorage.setItem('todolist', JSON.stringify(list))
        }
    }
    removeData = index => {
        const list = this.state.list
        list.splice(index, 1)
        this.setState({
            list: list
        })
        // 使用storage缓存数据，只能存字符串
        localStorage.setItem('todolist', JSON.stringify(list))
    }
    changeChecked = index => {
        const list = this.state.list
        list[index].checked = !list[index].checked
        this.setState({
            list: list
        })
        // 使用storage缓存数据，只能存字符串
        localStorage.setItem('todolist', JSON.stringify(list))
    }
    // 一刷新就加载的生命周期函数
    componentDidMount() {
        // 获取数据，字符串转为JSON
        const list = JSON.parse(localStorage.getItem('todolist'))
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
```

![](https://upload-images.jianshu.io/upload_images/7016617-25bd49a266102f9b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
新增后，不论怎么刷新页面都还是有数据


### 四、封装 Storage

由于`Storage.getItem`和`Storage.setItem`都要`JSON`格式转来转去，于是封装，封装后只要调用`set`，`get`就行了，不需要考虑JSON格式转换

1. 封装一个storage：

![](https://upload-images.jianshu.io/upload_images/7016617-a47dcf28de4c77c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在src下新建一个名为model的文件夹，里面再新建storage.js


```
const storage = {
    set(key, value) {
        return localStorage.setItem(key, JSON.stringify(value))
    },
    get(key) {
        return JSON.parse(localStorage.getItem(key))
    }
}

export default storage
```

2. 在`Todolist`组件中引入`storage`：`import storage from '../model/storage'`

3. 把里面的存储都改为`storage.set('todolist', list)`，获取都改为`storage.get('todolist')`

```
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
```

![](https://upload-images.jianshu.io/upload_images/7016617-f6d39e77f216ec80.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
新增一条拖地代办后，怎么刷新都不会变
