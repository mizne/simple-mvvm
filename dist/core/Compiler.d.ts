import MVVM from './MVVM';
export default class Compile {
    private $el;
    private $vm;
    private $fragment;
    constructor(el: Node | string, vm: MVVM);
    node2Fragment(el: Node): DocumentFragment;
    init(): void;
    compileNode(el: Node): void;
    compileElement(el: Element): void;
    isElement(node: Node): boolean;
    isTextNode(node: Node): boolean;
    isDirective(attr: string): boolean;
    isEventDirective(attr: string): boolean;
    compileText(node: Node, exp: string): void;
}
