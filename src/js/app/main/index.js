import Const from 'common/const';

console.log(Const.getData('status'));
console.log(Const.getData('os'));
console.log(Const.getData({col: 'tagType', hasDef: false}));
Const.type().then(()=>{
    console.log(Const.getData({col: 'type', def: '请选择'}));
});
Const.ensure(['type']).then(()=>{
    console.log(Const.getData({col: 'type'}));
    console.log(Const.getData({col: 'type', filterByVal: ['应用']}));
    console.log(Const.getData({col: 'type', filterByKey: [1]}));
    console.log(Const.getKey('type', '应用'));
    console.log(Const.getVal('type', 1));
});
