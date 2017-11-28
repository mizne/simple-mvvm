const MVVM = require('./MVVM')

const vm = new MVVM({
  data: {
    a: 1,
    b: {
      c: 4
    }
  }
})

vm.$watch('a', function (newV, oldV) {
  console.log(`newV: ${newV}`)
  console.log(`oldV: ${oldV}`)
})

vm.$watch('b.c', function (newV, oldV) {
  console.log(`newV b.c: ${newV}`)
  console.log(`oldV b.c: ${oldV}`)
})

console.log('set a before')
vm.a = 11
console.log('set a after')
vm.b.c = 42
console.log('set b.c after')