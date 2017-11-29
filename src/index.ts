import MVVM from './core/MVVM'

export { MVVM }

const vm: any = new MVVM({
  el: 'body',
  data: {
    greet: 'hello',
    showText: true,
    test: {
      a: {
        b: {
          c: '11'
        }
      }
    }
  },
  methods: {
    toggleShow() {
      this.showText = !this.showText
    }
  }
})
