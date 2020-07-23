import {ALL_CATEGORY_SELECT_FLAG, LOCAL_StORAGE_KEY_BILLS} from '../constants';
import {Bill, Category, StringifiedBill, billTransformer} from '../helpers';
import {Observable} from '../Observable';

export const bills$ = new Observable<Bill[]>(
  (JSON.parse(
    localStorage.getItem(LOCAL_StORAGE_KEY_BILLS) || '[]'
  ) as StringifiedBill[]).map(billTransformer)
);
export const selectedMonth$ = new Observable<number>(0);
export const selectedCategory$ = new Observable<string>(
  ALL_CATEGORY_SELECT_FLAG
);
export const categories$ = new Observable<Category[]>([]);
