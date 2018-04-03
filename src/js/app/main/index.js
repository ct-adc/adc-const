import Const from 'common/const';

console.log(Const.getData({col: 'status'}));
console.log(Const.getData({col: 'os'}));
console.log(Const.getData({col: 'tagType'}));
Const.type().then(()=>{
    console.log(Const.getData({col: 'type'}));
});
Const.ensure(['type']).then(()=>{
    console.log(Const.getData({col: 'type'}));
    console.log(Const.getData({col: 'type', filterByVal: ['应用']}));
    console.log(Const.getData({col: 'type', filterByKey: [1]}));
    console.log(Const.getKey('type', '应用'));
    console.log(Const.getVal('type', 1));
});
