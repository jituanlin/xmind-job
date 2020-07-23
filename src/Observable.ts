import {Cons, replace, findDiffIdx} from './utils';

export type Observer<S> = (s: S) => void;

export type Unpack<Boxed> = Boxed extends Observable<infer S> ? S : never;

export type Observablified<XS> = {
  [K in keyof XS]: Observable<XS[K]>;
};

export type UnObservablified<XS extends Observable<any>[]> = {
  [K in keyof XS]: Unpack<XS[K]>;
};

export type ComputedObservable<S> = Omit<Observable<S>, 'modify'>;

export class Observable<S> {
  private preState: S | undefined = undefined;
  private state: S;
  private observers: Observer<S>[] = [];
  // 双向绑定类型的observer与这个Observer中modify的Observable的逆向映射
  private bindingObToObservers: Map<
    // 这里如果用unknown会很麻烦, 因为TS严格模式下的strictFunctionCheck(函数参数逆变)
    Observable<any>,
    Observer<any>[]
  > = new Map();

  constructor(state: S) {
    this.state = state;
  }

  // state对写封闭, 对读开放
  getState(): S {
    return this.state;
  }

  getPreState(): S | undefined {
    return this.preState;
  }

  modify(f: (s: S) => S): void {
    this.preState = this.state;
    this.state = f(this.state);
    this.notify();
  }

  private notify(): void {
    this.observers.forEach(f => f(this.state));
    this.bindingObToObservers.forEach(observers =>
      observers.forEach(observer => observer(this.getState()))
    );
  }

  pushBindingObserver(
    bindingOb: Observable<any>,
    observer: Observer<any>
  ): void {
    const hasObBounded = this.bindingObToObservers.has(bindingOb);
    if (hasObBounded) {
      const hasObserverBounded = this.bindingObToObservers
        .get(bindingOb)!
        .includes(observer);
      if (hasObserverBounded) {
        return;
      }
      this.bindingObToObservers.get(bindingOb)!.push(observer);
      return;
    }
    this.bindingObToObservers.set(bindingOb, [observer]);
  }

  removeBindingObserver(
    bindingOb: Observable<any>,
    observer: Observer<any>
  ): Observer<any>[] | undefined {
    const bindingObservers = this.bindingObToObservers.get(bindingOb);
    bindingObservers?.splice(bindingObservers!.indexOf(observer), 1);
    return bindingObservers;
  }

  pendingBindingObserver(bindingOb: Observable<any>): () => void {
    const bindingObservers = this.bindingObToObservers.get(bindingOb);
    this.bindingObToObservers.delete(bindingOb);
    const resumeBindingObserver = () => {
      if (bindingObservers) {
        this.bindingObToObservers.set(bindingOb, bindingObservers);
      }
    };
    return resumeBindingObserver;
  }

  /**
   * @description 新增监听器, 每一次state改变, 都会调用这个监听函数
   * @param observer 监听函数
   * @param modifiedOb 在observe的监听函数中modify到的Observable
   */
  observe(observer: Observer<S>, modifiedOb?: Observable<any>): () => void {
    if (modifiedOb) {
      // 通过修改原来的observer, 消除循环更新
      const observerRemovedCircleBind = (state: S) => {
        const resumeCircleBindingObserver = modifiedOb.pendingBindingObserver(
          this
        );
        observer(state);
        resumeCircleBindingObserver();
      };
      this.pushBindingObserver(modifiedOb, observerRemovedCircleBind);
      return () =>
        this.removeBindingObserver(modifiedOb, observerRemovedCircleBind);
    } else {
      this.observers = this.observers.concat(observer);
      return () => this.observers.splice(this.observers.indexOf(observer), 1);
    }
  }

  /*
    返回值直接写Observable<S,...Sequence<SS>>会报错,
    这是TS的bug: 即使Sequence<SS>推断为数组, 还是会报rest type must be a array的错误,
    因为[...T]中的T必须来自函数的参数
    TODO(jituanlin): 需要增加一个destroy函数, 对1.依赖的Observable进行解绑 2.清除所有的监听函数
    这里有内存泄露的问题,
    组合后的Observable和依赖的Observable之间只要有一个Reachable的,
    那么所有的Observable的内存都不会被释放
    */
  combine<SS extends Array<Observable<any>>>(
    ...otherDepObs: SS
  ): Observable<Cons<S, UnObservablified<SS>>> {
    const combinedOb = (new Observable([
      this.state,
      ...otherDepObs.map(s => s.getState()),
    ]) as unknown) as Observable<Cons<S, UnObservablified<SS>>>;
    Observable.bidirectionalBindCombinedObWithDepObs(combinedOb, [
      this,
      ...otherDepObs,
    ]);
    return combinedOb;
  }

  // 派生一个Observable, 会进行双向绑定
  derive<R>(compute: (s: S) => R, reserveCompute: (r: R) => S): Observable<R> {
    const newOb = new Observable(compute(this.state));
    this.observe(state => newOb.modify(() => compute(state)), newOb);
    newOb.observe(state => this.modify(() => reserveCompute(state)), this);
    return newOb;
  }

  // 类似derive, 区别在于compute是单向绑定, 兵器不能进行modify
  compute<R>(compute: (s: S) => R): ComputedObservable<R> {
    const newOb = new Observable(compute(this.state));
    this.observe(state => newOb.modify(() => compute(state)), newOb);
    delete newOb.modify;
    return newOb;
  }

  // 如果组合类型的Observable状态发生改变, 那么对应的依赖的Observable也要进行改变
  static bindCombinedObToDepObs<T extends unknown[]>(
    combinedOb: Observable<T>,
    depObs: Observable<T[number]>[]
  ): void {
    const depObservers = depObs.map(
      (depOb, currentIdx) => (combinedObState: T) => {
        const preState = combinedOb.getPreState();
        const changedDepIdx = findDiffIdx(preState!, combinedObState);
        if (changedDepIdx.includes(currentIdx)) {
          depOb.modify(() => combinedObState[currentIdx]);
        }
      }
    );
    depObservers.forEach((depObserver, idx) => {
      combinedOb.observe(depObserver, depObs[idx]);
    });
  }

  // 任何依赖的Observable的改变, 组合的Observable也要进行改变
  static bindDepObToCombinedOb<T extends any[]>(
    combinedOb: Observable<T>,
    depObs: Observablified<T[number][]>
  ): void {
    const bindingObservers = depObs.map(
      (depOb, idx) => (depObState: T[number]) =>
        combinedOb.modify(combinedState =>
          replace(combinedState, idx, depObState)
        )
    );

    bindingObservers.forEach((observer, idx) => {
      depObs[idx].observe(observer, combinedOb);
    });
  }

  static bidirectionalBindCombinedObWithDepObs<T extends any[]>(
    combinedOb: Observable<T>,
    depObs: Observablified<T[number][]>
  ): void {
    Observable.bindCombinedObToDepObs(combinedOb, depObs);
    Observable.bindDepObToCombinedOb(combinedOb, depObs);
  }
}
