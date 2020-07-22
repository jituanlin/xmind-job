import {formatAmount, BillType} from './../helpers';
import {filteredBills$} from './filteredBills';
import {categoryIdToCategoryName$} from './categoryIdToCategoryName';

export const categorizedSummaryHTML$ = filteredBills$
  .combine(categoryIdToCategoryName$)
  .compute(([filteredBills, categoryIdToCategoryName]) => {
    const categoryIdToAmount = filteredBills.reduce(
      (result: Record<string, number>, bill) => {
        if (bill.type === BillType.支出 && bill.category) {
          result[bill.category] = result[bill.category]
            ? result[bill.category] + bill.amount
            : bill.amount;
        }
        return result;
      },
      {}
    );

    if (Object.keys(categoryIdToAmount).length === 0) {
      return '';
    }

    const headerHTML = `<div>所选月份分类排行如下:</div>`;
    const categoryRankHTML = Object.entries(categoryIdToAmount)
      .sort(
        ([categoryIdA, amountA], [categoryIdB, amountB]) => amountA - amountB
      )
      .map(
        ([categoryId, amount]) =>
          `<div>${categoryIdToCategoryName[categoryId]}: ${formatAmount(
            amount
          )}</div>`
      )
      .join('\n');
    return headerHTML + categoryRankHTML;
  });
