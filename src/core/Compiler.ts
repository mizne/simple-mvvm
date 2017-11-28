import Watcher from './Watcher'
import MVVM from './MVVM'

export default class Compile {
  private $el: Node
  private $vm: MVVM
  private $fragment: DocumentFragment
  constructor(el: Node | string, vm: MVVM) {
    this.$vm = vm
    this.$el = typeof el === 'string' ? document.querySelector(el) : el
    if (this.$el) {
      this.$fragment = this.node2Fragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment(el: Node): DocumentFragment {
    const fragment = document.createDocumentFragment()
    let child

    while ((child = el.firstChild)) {
      fragment.appendChild(child)
    }
    return fragment
  }

  init() {
    this.compileNode(this.$fragment)
  }
  compileNode(el: Node) {
    const childNodes = el.childNodes
    const reg = /\{\{(.*)\}\}/

    Array.from(childNodes).forEach(node => {
      if (this.isElement(node)) {
        this.compileElement(node as Element)
      } else if (this.isTextNode(node) && reg.test(node.textContent)) {
        this.compileText(node, RegExp.$1)
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node)
      }
    })
  }
  compileElement(el: Element) {
    const attrs = el.attributes

    Array.from(attrs).forEach(attr => {
      const name = attr.name
      if (this.isDirective(name)) {
        const exp = attr.value
        const dir = name.substring(2)

        if (this.isEventDirective(dir)) {
          Compiles.eventHandler(el, this.$vm, exp, dir)
        } else {
          Compiles[dir + 'Dir'] && Compiles[dir + 'Dir'](el, this.$vm, exp)
        }
        el.removeAttribute(name)
      }
    })
  }

  isElement(node: Node) {
    return node.nodeType === 1
  }

  isTextNode(node: Node) {
    return node.nodeType === 3
  }

  isDirective(attr: string) {
    return attr.indexOf('v-') === 0
  }

  isEventDirective(attr: string) {
    return attr.indexOf('on') === 0
  }

  compileText(node: Node, exp: string) {
    Compiles.textDir(node, this.$vm, exp)
  }
}

const updaters: {
  [key: string]: Function
} = {
  textUpdater(node: Node, value: any) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },
  ifUpdater(node: Node, value: any) {
    ;(node as HTMLElement).style.display = value ? 'block' : 'none'
  }
}

const Compiles: { [key: string]: Function } = {
  textDir(node: Node, vm: MVVM, exp: string) {
    Compiles.bind(node, vm, exp, 'text')
  },
  ifDir(node: Node, vm: MVVM, exp: string) {
    Compiles.bind(node, vm, exp, 'if')
  },

  bind(node: Node, vm: MVVM, exp: string, dir?: string) {
    const updaterFn = updaters[dir + 'Updater']

    updaterFn && updaterFn(node, Compiles.getVmVal(vm, exp))

    new Watcher(vm, exp, function(newV: any, oldV: any) {
      updaterFn && updaterFn(node, newV, oldV)
    })
  },
  eventHandler(node: Node, vm: MVVM, exp: string, dir: string) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },
  getVmVal(vm: any, exp: string) {
    let val = vm
    const exps = exp.split('.')
    exps.forEach(k => {
      val = val[k]
    })
    return val
  }
}
