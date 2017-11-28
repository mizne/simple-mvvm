import MVVM from './core/MVVM'

export { MVVM }

const vm: any = new MVVM({
  el: 'body',
  data: {
    greet: 'hello',
    test: {
      a: {
        b: {
          c: '11'
        }
      }
    }
  },
  methods: {
    changeText() {
      this.greet = ''
    }
  }
})
