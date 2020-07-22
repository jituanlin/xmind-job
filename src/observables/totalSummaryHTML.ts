import {filteredBills$} from './filteredBills';
import {BillType, formatAmount} from '../helpers';

export const totalSummaryHTML$ = filteredBills$.compute(filteredBills => {
  if (filteredBills.length === 0) {
    return '';
  }
  const income = filteredBills
    .filter(bill => bill.type === BillType.收入)
    .reduce((amount, bill) => amount + bill.amount, 0);

  const expense = filteredBills
    .filter(bill => bill.type === BillType.支出)
    .reduce((amount, bill) => amount + bill.amount, 0);
  return `
       <div>所选月份收入:${formatAmount(income)}</div>
       <div>所选月份支出:${formatAmount(expense)}</div>
        `;
});
