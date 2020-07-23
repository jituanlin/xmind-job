import {categories$} from './basic';

export const categoryInputInnerHTML$ = categories$.compute(categories =>
  ['<option value="">无</option>']
    .concat(
      categories.map(
        category => `<option value="${category.id}">${category.name}</option>`
      )
    )
    .join('\n')
);
