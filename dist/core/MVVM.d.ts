export default class MVVM {
    $options: any;
    private _data;
    private $compile;
    constructor(options: any);
    $watch(key: string, cb: Function, options: any): void;
    _proxyData(key: string): void;
}
