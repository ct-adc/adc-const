## ct-adc-const

用于维护项目中前后端约定好的一些常量

## 组件示例图

无

## 在线demo

无

## 功能点

1. 集中管理常量
2. 满足不同的获取常量的需求，如是否带有默认值，是否需要过滤出常量的子集合
3. 支持异步获取的常量，或静态的常量配置

## 使用

从npm安装ct-adc-const

```
npm install ct-adc-const --save
```
在代码中使用

```
import Const from 'const';

const con = new Const();
const status = [{
    key: '',
    val: '不限'
}, {
    key: 1,
    val: '已启用'
}, {
    key: 2,
    val: '已禁用'
}];
const os = [{
    key: '',
    val: '不限'
}, {
    key: 1,
    val: '安卓'
}, {
    key: 2,
    val: 'IOS'
}];
const tagType = [{
    key: '',
    val: '请选择'
}, {
    key: true,
    val: '标签'
}, {
    key: false,
    val: '非标签'
}];
// 添加静态常量
con.add({status: status, os: os});
con.add({tagType});
// 注册异步常量
con.register('type', {
    axios: {
        url: '/api/type',
        transformResponse: [data=>{
            data = JSON.parse(data);

            if (data.Code === 0){
                return {
                    status: true,
                    data: data.Data
                };
            }
            return {
                status: false,
                data: []
            };
        }],
        params: {
            owner: 'tcy'
        }
    },
    resolve: {
        key: 'Id',
        val: 'Val'
    }
});

export default con;
```

值得说明的是，当前的插件其实就是提供一个Const类，开发者可以根据项目需求定义一个Const实例，在需要的时候调用该实例的相关方法。

## 方法

### add

添加静态数据

#### 参数列表

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ----
dataList | 需要添加的数据列表 | Object | {} | 如下描述 | 需要添加的数据列表

dataList必须满足以下条件：

1. 每项的值为一个数组，即常量数据的值列表。

2. 值列表中的每项必须包含两个属性，分别为key和val。

3. dataList中每项的key为常量数据的key，后续需据此获取数据。如下例中的tagType

4. 值列表的第一项必须是默认项，且默认值的val必须为'不限'

举例说明：

```
{
    tagType: [{
         key: '',
         val: '不限'
     }, {
         key: true,
         val: '标签'
     }, {
         key: false,
         val: '非标签'
     }]
}

```

返回值

undefined


### register

注册异步数据

#### 参数列表

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ----
col | 指定数据的key | String | 无 | 任何String | 后续会据此获取数据
options | 异步数据配置 | Object | [异步数据配置](#options) | [异步数据配置](#options) | [异步数据配置](#options)

#### 返回值

undefined

### ensure

确保异步数据获取成功的任务。当一些异步数据确认获取后再进行下一步操作时可以使用该方法

#### 参数列表

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ----
list | 需要请求的数据 | {Object|Array} | 无 | 见下 | 

list支持两种指定方式：

1. 每一项为一个数据key，如['tagType', 'status']，那么将获取tagType和status两个常量

2. 每一项为一个对象，其中对象的col属性指定了数据key, 而options则可以覆盖注册异步数据时的某些配置，来获取数据。如：

```
{
    col: 'type',
    options: {
         axios: {
             params: {
                 owner: 'tcy'
             }
         }
    }
}
```

#### 返回值

一个Promise实例，即使用Promise.all(数据任务队列)生成的Promise实例。

### getData

获取一个常量数据

#### 参数列表

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ----
col | 要获取的数据的key | String | 无 | 已添加或注册到Const实例的常量的key | 以此来获取对应的常量
hasDef | 结果中是否需要包含默认值 | Boolean | true | true/false | 
def | 结果中的默认值对应的val是什么 | 基本类型 | '不限' | 任何基本类型的值 | hasDef为true时生效
filterByKey | 结果中需要包含的项 | Array | undefined | 每项为任何基本类型的值 | key等于其中任一项的常量项会被返回
filterByVal | 结果中需要包含的项 | Array | undefined | 每项为任何基本类型的值 | val等于其中任一项的常量项会被返回

#### 返回值

Array

即要获取的常量数据

### getVal

根据key获取val

#### 参数列表

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ----
col | 要获取的数据的key | String | 无 | 已添加或注册到Const实例的常量的key | 以此来获取对应的常量
key | 指定的key |基本类型 | 无 | 基本类型 | col对应的常量中key等于此值的项的val会被返回
def | 默认值的val | 基本类型 | '不限' | 基本类型 | 当对应到的项为默认项时，需要将默认项的val转换为该值

#### 返回值

基本类型 或 undefined

当匹配到内容时，返回对应的val；匹配不到时返回undefined;

### getKey

根据val获取key

#### 参数列表

参数 | 说明 | 类型 | 默认值 | 可选值 | 描述 |
--- | --- | --- | --- | ---- | ----
col | 要获取的数据的key | String | 无 | 已添加或注册到Const实例的常量的key | 以此来获取对应的常量
val | 指定的val |基本类型 | 无 | 基本类型 | col对应的常量中val等于此值的项的key会被返回

#### 返回值

基本类型 或 undefined

当匹配到内容时，返回对应的key；匹配不到时返回undefined;


## 其他

### options

```
{
    //axios配置项，参考axios官方文档
    axios: {
        url: '',
        method: 'get',
        transformResponse: [(data) => {
            data = JSON.parse(data);

            if (data.Code === 0) {
                return {
                    status: true,
                    data: data.Data
                };
            }
            return {
                status: false,
                data: []
            };
        }]
    },
    //是否读取缓存数据
    cache: true,
    //是否需要自动加入一个默认值
    default: {
        //是否加入默认值
        append: true,
        //该默认值中key字段的值
        key: ''
    }
}

```

[axios官方文档](https://github.com/axios/axios)


## 注意事项


1. 每个常量中的每一项必须含有key和val两个属性

2. 每个常量数据必须有一个默认值，且该默认值的val必须为'不限'

## 更新日志

[更新日志]({CHANGELOG.md的线上地址})

## 外部资源依赖列表

- jdPicker.js V2.0.0+

- webUploader V1.5.0+

