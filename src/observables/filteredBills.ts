import {ALL_CATEGORY_SELECT_FLAG} from '../constants';
import {Bill, MonthSelectorIndex} from '../helpers';
import {bills$, selectedCategory$, selectedMonth$} from './basic';

export const filteredBills$ = bills$
  .combine(selectedMonth$, selectedCategory$)
  .compute(([bills, selectedMonth, selectedCategory]) => {
    const monthFilter = (bill: Bill) =>
      selectedMonth === MonthSelectorIndex.All ||
      bill.time.getMonth() + 1 === selectedMonth;
    const categoryFilter = (bill: Bill) =>
      selectedCategory === ALL_CATEGORY_SELECT_FLAG ||
      bill.category === selectedCategory;

    const filteredBills = bills.filter(monthFilter).filter(categoryFilter);
    const sortedBills = filteredBills.sort(
      (billA, billB) => Number(billA.time) - Number(billB.time)
    );
    return sortedBills;
  });
