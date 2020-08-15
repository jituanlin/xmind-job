# xmind招聘作业
本项目为[xmind招聘作业](https://github.com/xmindltd/hiring/tree/master/frontend-1)的实现

## 技术设计

### 思路
据调查,xmind公司招聘人员时较为注重考查JS基本功,故本项目未使用任何框架/依赖库,  
而是自己实现了一套`可组合/派生的Observable`的机制, 通过这套机制实现了`视图响应数据`的响应式编程.  
作为应聘技术展示, 本项目注重展示TS/JS基本功, 未作任何兼容性措施, 亦未进行交互/UI设计(此亦为作者本身弱项).

#### 实现细节
在本项目中, Observable指的是  
> 一个封装状态的, 可以使用modify对其状态进行修改的, 同时可以使用observe对其状态变化进行监听的容器.  

此外, Observable的combine操作可以将当前与其他Obserable进行组合, 得到一个新的状态为数组的Observable:  
```typescript
const obA = new Observable(1);
const obB = new Observable('2');
const newOb = obA.combine(obB);
assert.deepEqual(newOb.getState(),[1,'2']);
```
在上述例子中, 对obA或obB进行modify都会触发newOb的状态的变化, 同时对newOb进行modify也会  
反过来触发对obA或obB的状态的修改, 即combine后的Observable和依赖的Observable之间是双向绑定的.  
如果未对双向绑定机制做任何处理, 将会导致循环更新, 即: 
> newOb的修改触发obA(或obB)的修改, obA(或obB)的修改触发newOb的修改, newOb的修改触发obA(或obB)的修改...  

为此, Observable新增一个机制:
1. 在对Observable(记为`this`)进行observe的时候, 记录下监听函数中modify的其他Observable  
(记为`modifiedOb`, 称为这个监听函数依赖了`modifyOb`）
2. 在`this`的内部状态发生改变, 调用监听函数时, 将modifiedOb中所有依赖了this的监听函数进行禁用,  
从而打破循环更新


#### 文件结构
已下对可能有歧义的文件结构进行释疑
```bash
// src文件夹下
├── Observable.test.ts 
├── Observable.ts // 核心机制的实现
├── constants.ts 
├── helpers.ts // 一些便利的, 业务逻辑紧耦合的函数/类型
├── index.ts  // 对DOM进行绑定操作, 绑定监听时间, 初始化状态都在这里
├── observables // 所有的派生的, 基础的Observable
│   ├── basic.ts
│   ├── billListHTML.ts // 以HTML结尾的文件为内部状态为HTML的Observable, 用于插入到DOM中, 下同
│   ├── categorizedSummaryHTML.ts 
│   ├── categoryIdToCategoryName.ts
│   ├── categoryInputInnerHTML.ts
│   ├── categorySelectorInnerHTML.ts
│   ├── filteredBills.ts
│   └── totalSummaryHTML.ts
├── services.ts // 后端API调用, 这里mock下
├── utils.test.ts 
└── utils.ts // 一些便利的, 与业务逻辑无关的函数/类型
```

## 如何检阅
### 启动项目
1. `npm install`
2. `npm start`
3. `使用chrome浏览器打开`./index.html`文件`

### 运行测试
`npm run test`

## 注
1. 本项目大量使用字符串拼接HTML的手法, 请使用`es6-string-html`vscode插件方便阅读.
2. 命名规范: `$`开头表示是Observable.


