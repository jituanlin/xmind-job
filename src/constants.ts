export const IMPORT_BUTTON_ID = 'import-button';
export const INPUT_FILE_ID = 'input-file';
export const BILL_LIST_ID = 'bill-list';
export const CATEGORY_SELECTOR_ID = 'category-selector';
export const MONTH_SELECTOR_ID = 'month-selector';
export const ALL_CATEGORY_SELECT_FLAG = 'ALL_CATEGORY_SELECT_FLAG';
export const TOTAL_SUMMARY_ID = 'total-summary';
export const CATEGORIZED_SUMMARY_ID = 'categorized-summary';
export const TIME_INPUT_ID = 'time-input';
export const CATEGORY_INPUT_ID = 'category-input';
export const ADD_BILL_BUTTON_ID = 'add-bill-button';
export const ADD_BILL_FORM_ID = 'add-bill-form';

export const importButtonElm = document.getElementById(
  IMPORT_BUTTON_ID
) as HTMLElement;
export const fileInputElm = document.getElementById(
  INPUT_FILE_ID
) as HTMLInputElement;
export const billListElm = document.getElementById(
  BILL_LIST_ID
) as HTMLDivElement;
export const categorySelectorElm = document.getElementById(
  CATEGORY_SELECTOR_ID
) as HTMLSelectElement;
export const monthSelectorElm = document.getElementById(
  MONTH_SELECTOR_ID
) as HTMLDivElement;
export const totalSummaryElm = document.getElementById(
  TOTAL_SUMMARY_ID
) as HTMLDivElement;
export const categorizedSummaryElm = document.getElementById(
  CATEGORIZED_SUMMARY_ID
) as HTMLDivElement;
export const timeInputElm = document.getElementById(
  TIME_INPUT_ID
) as HTMLInputElement;
export const categoryInputElm = document.getElementById(
  CATEGORY_INPUT_ID
) as HTMLSelectElement;
export const addBillButtonElm = document.getElementById(
  ADD_BILL_BUTTON_ID
) as HTMLButtonElement;
export const addBillFormElm = document.getElementById(
  ADD_BILL_FORM_ID
) as HTMLFormElement;

export const LOCAL_StORAGE_KEY_BILLS = 'LOCAL_StORAGE_KEY_BILLS';
