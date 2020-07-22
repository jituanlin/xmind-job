import {categories$} from './basic';
import {Observable} from '../Observable';

export const categoryIdToCategoryName$ = categories$.compute(categories =>
  Object.fromEntries(categories.map(category => [category.id, category.name]))
) as Observable<Record<string, string>>;
