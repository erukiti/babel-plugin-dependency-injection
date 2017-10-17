const path = require('path')
const {transform, transformFileSync} = require('babel-core')

const opts = {
    'example/hoge.js': {
        replace: {
            'const hoge =': '"const hoge replaced"',
            'function fuga': 'function fuga() {console.log("function fuga replaced")}',
            'class Piyo': `
            class Piyo {
                constructor() {
                    console.log('class Piyo replaced')
                }
                get() {
                    return 'piyo'
                }
            }
            `
        },
        insert: {
            last: 'module.exports.Piyo = Piyo'
        }
    }
}

const {code} = transformFileSync('example/hoge.js', {plugins: [[require('../'), opts]]})
console.log(code)
