import {Stringify} from './utils';
import {ComputedObservable} from './Observable';

// 虽然用中文命名看起来low， 但是真的好用
export enum BillType {
  支出 = 0,
  收入 = 1,
}

export interface Bill {
  type: BillType;
  time: Date;
  category?: string;
  amount: number;
}

export const expect = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const billValidator = (input: any): void => {
  const errorMessage = '不是有效账单数据';
  expect(
    input.type === BillType.支出 || input.type === BillType.收入,
    errorMessage
  );
  expect(input.time instanceof Date && !isNaN(input.time), errorMessage);
  expect(
    input.category === undefined || typeof input.category === 'string',
    errorMessage
  );

  expect(
    typeof input.amount === 'number' && !isNaN(input.amount),
    errorMessage
  );
};

export type StringifiedBill = Stringify<Bill>;

export const billTransformer = (origin: StringifiedBill): Bill => {
  return {
    type: Number(origin.type),
    time: isNaN(Number(origin.time))
      ? new Date(origin.time)
      : new Date(Number(origin.time)),
    category: origin.category === '' ? undefined : origin.category,
    amount: Number(origin.amount),
  };
};

export interface Category {
  name: string;
  id: string;
  type: BillType;
}

export type StringifiedCategory = Stringify<Category>;

export type CategoryIdToCategoryName = Record<string, string>;

export enum MonthSelectorIndex {
  All = 0,
  Jan,
  Feb,
  Mar,
  Apr,
  May,
  Jun,
  Jul,
  Aug,
  Sept,
  Oct,
  Nov,
  Dec,
}

export const formatAmount = (amount: number): string =>
  (amount / 100).toFixed(2);

export const render = (
  htmlObservable: ComputedObservable<string>,
  htmlElement: HTMLElement
): void => {
  htmlObservable.observe(html => {
    htmlElement.innerHTML = html;
  });
};
