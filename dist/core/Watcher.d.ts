import { Dep } from './Observer';
import MVVM from './MVVM';
export default class Watcher {
    private vm;
    private expOrFn;
    private cb;
    private deps;
    private getter;
    private value;
    constructor(vm: MVVM, expOrFn: string | Function, cb: Function);
    update(): void;
    addDep(dep: Dep): void;
    get(): any;
    parseGetter(exp: string): (obj: any) => any;
}
