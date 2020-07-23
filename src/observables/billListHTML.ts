import {filteredBills$} from './filteredBills';
import {categories$} from './basic';
import {
  CategoryIdToCategoryName,
  Bill,
  BillType,
  formatAmount,
} from '../helpers';
import {categoryIdToCategoryName$} from './categoryIdToCategoryName';

const getComputeBillTableRow = (
  categoryIdToCategoryName: CategoryIdToCategoryName
) => (bill: Bill) => {
  return `
    <tr>
      <td> ${BillType[bill.type]} </td>
      <td> ${bill.time.toLocaleDateString()} </td>
      <td> ${bill.category ? categoryIdToCategoryName[bill.category] : ''} </td>
      <td> ${formatAmount(bill.amount)} </td>
    </tr>
    `;
};

export const billListHTML$ = filteredBills$
  .combine(categories$, categoryIdToCategoryName$)
  .compute(([filteredBills, categories, categoryIdToCategoryName]) => {
    if (filteredBills.length === 0 || categories.length === 0) {
      return '无数据';
    }

    const computeBillTableRow = getComputeBillTableRow(
      categoryIdToCategoryName
    );

    const headerHTML = `
    <thead>
      <tr>
        <th>类型</th>
        <th>时间</th>
        <th>分类</th>
        <th>金额</th>
      </tr>
    </thead>
    `;
    return `
    <table>
      ${headerHTML}
      <tbody>
        ${filteredBills.map(computeBillTableRow).join('\n')}
      </tbody>
    </table>`;
  });
