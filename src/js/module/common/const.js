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
    val: '不限'
}, {
    key: true,
    val: '标签'
}, {
    key: false,
    val: '非标签'
}];

con.add({status: status, os: os});
con.add({tagType});

con.register('type', {
    axios: {
        url: '/api/type',
        params: {
            owner: 'tcy'
        }
    },
    resolve: {
        key: 'Id',
        val: 'Val'
    }
});

con.register('version', {
    axios: {
        url: '/api/version',
        transformResponse: [(data) => {
            data = JSON.parse(data);

            if (data.Code === 0) {
                return {
                    status: true,
                    data: data.Data.map(item=>{
                        return {
                            key: item,
                            val: item
                        };
                    })
                };
            }
            return {
                status: false,
                data: []
            };
        }]
    }
});

console.log(con);
export default con;
