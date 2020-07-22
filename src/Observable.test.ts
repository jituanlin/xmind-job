import {Observable} from './Observable';

test('observable trigger observer when modify ', () => {
  let n = 0;
  const observable = new Observable(1);
  observable.observe(x => (n = x));
  expect(n).toBe(0);
  observable.modify(x => x + 1);
  expect(n).toBe(2);
});

test('observable combine op will receive array of observables state', () => {
  const combinedOb = new Observable(2).combine(new Observable(3));
  combinedOb.modify(s => {
    expect(s).toEqual([2, 3]);
    return s;
  });
});

test('observable preState will record observable previous state', () => {
  const ob = new Observable(1);
  ob.modify(() => -1);
  expect(ob.getPreState()).toBe(1);
});

test('dependent observable modify will trigger combined observable notify', () => {
  const ob1 = new Observable(1);
  const ob2 = new Observable(2);
  const combinedOb = ob1.combine(ob2);
  ob1.modify(() => -1);
  expect(combinedOb.getState()).toEqual([-1, 2]);
});

test('combined observable only trigger minimal dependent observable modify', () => {
  const ob1 = new Observable(1);
  const ob2 = new Observable(2);
  let state2 = 0;
  const combinedOb = ob1.combine(ob2);
  ob2.observe(() => (state2 = 1));
  combinedOb.modify(() => [-1, 2]);
  expect(state2).toBe(0);
});

test('dependent observable modify will trigger combined observable notify', () => {
  const ob1 = new Observable(1);
  const ob2 = new Observable(2);
  const combinedOb = ob1.combine(ob2);
  let n = 0;
  combinedOb.observe(() => (n = 1));
  combinedOb.modify(() => [-1, 2]);
  expect(ob1.getState()).toBe(-1);
  expect(n).toBe(1);
});

test('derived observable is bidirectional bind', () => {
  const obA = new Observable(-1);
  const obB = obA.derive(
    n => ({n}),
    obj => obj.n
  );
  let stateB = {n: -1};
  obB.observe(s => (stateB = s));
  obA.modify(n => n + 1);
  expect(stateB).toEqual({n: 0});

  let stateA = 0;
  obA.observe(n => (stateA = n));
  obB.modify(({n}) => ({n: n + 1}));
  expect(stateA).toBe(1);
});

test('computed observable will observer up steam observable change', () => {
  let state = 0;
  const upStreamOb = new Observable(1);
  const computedOb = upStreamOb.compute(n => n - 1);
  computedOb.observe(n => (state = n));
  upStreamOb.modify(n => n + 1);
  expect(state).toBe(1);
});
