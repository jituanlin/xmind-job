import {categories$} from './basic';
import {ALL_CATEGORY_SELECT_FLAG} from '../constants';

export const categorySelectorInnerHTML$ = categories$.compute(categories =>
  [`<option value="${ALL_CATEGORY_SELECT_FLAG}">所有分类</option>`]
    .concat(
      categories.map(
        category => `<option value="${category.id}">${category.name}</option>`
      )
    )
    .join('\n')
);
