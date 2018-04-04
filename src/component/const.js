import axios from 'axios';
import utility from 'ct-utility';

const defaults = {
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
};
const defaultConfig = {
    defaultVals: ['不限', '请选择', '全部']
};

class Const {
    /**
     * 创建一个const
     * @param config
     */
    constructor(config) {
        this.config = utility.base.extend(true, {}, defaultConfig, config);
    }

    isAsync(col) {
        return !Array.isArray(this[col]);
    }

    /**
     * 添加一个静态的常量数据
     * @param dataList {Object}
     * dataList中的每个key将被作为const实例的key，值会被作为实例的值
     */
    add(dataList = {}) {
        Object.keys(dataList).map(col => {
            this[col] = dataList[col];
        });
    }

    /**
     * 注册一个异步常量
     * @param col {String} const实例中数据的key
     * @param options {Object} 异步常量的请求 & 处理配置
     * options.axios {Object} axios配置项
     * options.cache {Boolean} 是否使用缓存数据
     * options.resolve {Boolean | Object} 如何处理数据
     * options.resolve.keyKey {String} 对应key的key
     * options.resolve.valKey {String} 对应val的key
     */
    register(col, options) {
        if (typeof this[col] === 'undefined') {
            this.defineData(col);
            this[col].options = utility.base.extend(true, {}, defaults, options);
        } else {
            console.warn(`ct-adc-const warning: ${col} has been registered`);
        }
    }

    resolveData(data, col, val, defaultOption) {
        const result = data.map(item => {
            return {
                key: item[col],
                val: item[val]
            };
        });

        if (defaultOption.append) {
            result.unshift({
                key: defaultOption.key,
                val: '不限'
            });
        }

        return result;
    }

    /**
     * 判断特定key的数据是否有缓存
     * @param col
     * @returns {boolean}
     */
    isHasCache(col) {
        return Array.isArray(this[col].data) && this[col].data.length > 0;
    }

    /**
     * 定义指定的key对应的异步方法
     * @param col
     */
    defineData(col) {
        this[col] = (options = {}) => {
            options = utility.base.extend(true, {}, this[col].options, options);

            // 如果使用缓存数据，且缓存中有数据时，直接返回缓存中的数据
            if (options.cache && this.isHasCache(col)) {
                return Promise.resolve(this[col].data);
            }
            // 如果不使用缓存数据，那么返回一个promise
            return axios.request(options.axios).then(response => {
                const res = response.data;

                if (options.resolve) {
                    if (res.status) {
                        this[col].data = this.resolveData(res.data, options.resolve.key, options.resolve.val, options.default);
                        return Promise.resolve(response);
                    }
                    return Promise.reject(response);
                }
                return Promise.resolve(response);
            });
        };
    }

    /**
     * 保证异步数据加载完成
     * @param list {Object|Array}
     * Object:
     * list.col 指定是哪个数据
     * list.options 同defaults配置项
     * Array:
     * list[n] {String} 同上的list.col 指定是哪个数据
     */
    ensure(list) {
        const promiseList = [];

        list.map(item => {
            let col;

            if (typeof item === 'string') {
                col = item;
            } else if (typeof item.col !== 'undefined') {
                col = item.col;
            }

            if (typeof this[col] === 'function') {
                promiseList.push(this[col](item.options));
            }
        });
        return Promise.all(promiseList);
    }

    /**
     * 获取某个常量的数据
     * @param conf
     * conf {Object}
     * @param conf.col String 需要获取的常量，如'auditStatus'
     * @param conf.hasDef Boolean 返回的数据中是否需要带默认值，如'全部'/'不限'
     * @param conf.def String 在hasDef为true时生效，此项指定默认值的描述，默认为'不限'；如果你需要默认值为'全部',请将参数def设置为'全部'
     * conf {String}
     * 会将conf作为需要获取的常量的key
     * @returns {Array.<T>|string|Blob|ArrayBuffer|*}
     */
    getData(conf) {
        if (typeof conf === 'string') {
            conf = {
                col: conf
            };
        }
        conf = utility.base.extend(true, {}, {hasDef: true, def: '不限'}, conf);
        let data;

        if (!this.isAsync(conf.col)) {
            data = this[conf.col];
        } else if (this.isHasCache(conf.col)) {
            data = this[conf.col].data;
        }

        const defaultItem = JSON.parse(JSON.stringify(data[0]));
        let dataClone = JSON.parse(JSON.stringify(data)).slice(1);

        if (Array.isArray(conf.filterByKey) && conf.filterByKey.length > 0) {
            dataClone = dataClone.filter(item => {
                return conf.filterByKey.indexOf(item.key) > -1;
            });
        }
        if (Array.isArray(conf.filterByVal) && conf.filterByVal.length > 0) {
            dataClone = dataClone.filter(item => {
                return conf.filterByVal.indexOf(item.val) > -1;
            });
        }
        console.log(conf);
        if (conf.hasDef) {
            dataClone.unshift(defaultItem);
        }
        if (conf.def !== '不限') {
            dataClone[0].val = conf.def;
        }
        return dataClone;
    }

    /**
     * 获取某个常量中指定key对应的val
     * @param col String 需要获取的常量，如'auditStatus'
     * @param key [js基础类型的数据] 指定需要获取val值对应的key值
     * @param def String 此项指定默认值的描述，默认为'不限'；如果你需要默认值为'全部',请将参数def设置为'全部'
     */
    getVal(col, key, def = '不限') {
        const data = this.getData({col});
        const matchedItem = data.filter((item) => {
            return item.key === key;
        });

        if (matchedItem.length > 0) {
            const isDefaultItem = matchedItem[0].val === '不限';

            if (isDefaultItem) {
                return def;
            }
            return matchedItem[0].val;
        }
    }

    /**
     * 获取某个常量中指定val对应的key
     * @param col String 需要获取的常量，如'auditStatus'
     * @param val String 指定需要获取key值对应的val值
     */
    getKey(col, val) {
        if (this.config.defaultVals.indexOf(val) > -1) {
            val = '不限';
        }
        const data = this.getData({col});
        const matchedItem = data.filter((item) => {
            return item.val === val;
        });

        if (matchedItem.length > 0) {
            return matchedItem[0].key;
        }
    }
}

export default Const;
