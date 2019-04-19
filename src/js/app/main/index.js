import Const from 'common/const';

window.Const = Const;
window.log = (d)=>{
    console.log(JSON.stringify(d));
};
//
// console.log(`Const.getData('status')`);
// console.log(JSON.stringify(Const.getData('status')));
// console.log('------------------');
//
// console.log(`Const.getData('os')`);
// console.log(JSON.stringify(Const.getData('os')));
// console.log('------------------');
//
// console.log(`Const.getData({col: 'tagType', hasDef: false})`);
// console.log(JSON.stringify(Const.getData({col: 'tagType', hasDef: false})));
// console.log('------------------');
//

console.log(Const.getData({col: 'tagType', hasDef: true, keyStandby: 'value', valStandby: 'label'}));
Const.type({
    axios: {
        params: {
            owner: 'tcy1'
        }
    }
}).then((response)=>{
    console.log('---------------------------------------------', response);
    console.log(`Const.getData({col: 'type', def: '请选择'})`);
    console.log(JSON.stringify(Const.getData({col: 'type', def: '请选择'})));
    console.log('------------------');
});
//
// Const.version().then(()=>{
//     console.log(`Const.getData({col: 'version', def: '请选择'})`);
//     console.log(JSON.stringify(Const.getData({col: 'version', def: '请选择'})));
//     console.log('------------------');
// });
//
// setTimeout(()=>{
//     Const.ensure(['type']).then(()=>{
//         console.log(`Const.getData({col: 'type'})`);
//         console.log(JSON.stringify(Const.getData({col: 'type'})));
//         console.log('------------------');
//
//         console.log(`Const.getData({col: 'type', filterByVal: ['应用']})`);
//         console.log(JSON.stringify(Const.getData({col: 'type', filterByVal: ['应用']})));
//         console.log('------------------');
//
//         console.log(`Const.getData({col: 'type', filterByKey: [1]})`);
//         console.log(JSON.stringify(Const.getData({col: 'type', filterByKey: [1]})));
//         console.log('------------------');
//
//         console.log(`Const.getKey('type', '应用')`);
//         console.log(Const.getKey('type', '应用'));
//         console.log('------------------');
//
//         console.log(`Const.getVal('type', 1)`);
//         console.log(Const.getVal('type', 1));
//         console.log('------------------');
//
//         console.log(`Const.getVal('type', '', '请选择')`);
//         console.log(Const.getVal('type', '', '请选择'));
//         console.log('------------------');
//     });
// }, 3000);

