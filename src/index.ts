import {
  bills$,
  categories$,
  selectedCategory$,
  selectedMonth$,
} from './observables/basic';
import {billListHTML$} from './observables/billListHTML';
import {categorySelectorInnerHTML$} from './observables/categorySelectorInnerHTML';
import {totalSummaryHTML$} from './observables/totalSummaryHTML';
import {
  billListElm,
  categorySelectorElm,
  fileInputElm,
  importButtonElm,
  monthSelectorElm,
  totalSummaryElm,
  timeInputElm,
  categoryInputElm,
  addBillFormElm,
  LOCAL_StORAGE_KEY_BILLS,
} from './constants';
import {
  Bill,
  billTransformer,
  render,
  billValidator,
  StringifiedBill,
} from './helpers';
import {getCategoriesCsv} from './services';
import {readCsvFile} from './utils';
import {categorizedSummaryElm} from './constants';
import {categorizedSummaryHTML$} from './observables/categorizedSummaryHTML';
import {categoryInputInnerHTML$} from './observables/categoryInputInnerHTML';

const addListeners = () => {
  monthSelectorElm.addEventListener('change', event =>
    selectedMonth$.modify(
      () => (event.target as HTMLSelectElement).selectedIndex
    )
  );

  categorySelectorElm.addEventListener('change', event => {
    selectedCategory$.modify(() => (event.target as HTMLSelectElement).value);
  });

  importButtonElm.addEventListener('click', () => {
    fileInputElm.click();
  });

  fileInputElm.addEventListener('change', async () => {
    const file = fileInputElm.files?.[0];
    let bills: Bill[] | undefined;
    try {
      bills = await readCsvFile(file!, billTransformer);
      bills.forEach(billValidator);
    } catch (error) {
      window.alert(`读取csv文件失败:${error.message},请重试`);
      return;
    }
    bills$.modify(() => bills!);
  });

  addBillFormElm.addEventListener('submit', event => {
    event.preventDefault();
    const form: any = new FormData(addBillFormElm);
    const bill = billTransformer(
      Object.fromEntries(form.entries()) as StringifiedBill
    );
    bill.amount = bill.amount * 100;
    try {
      billValidator(bill);
    } catch (error) {
      window.alert(`填入的账单字段有误: ${error.message}`);
      return;
    }
    bills$.modify(bills => bills.concat(bill));
    addBillFormElm.reset();
    initTimeInputValue();
  });
};

const initCategories = () => {
  getCategoriesCsv().then(
    categories => categories$.modify(() => categories),
    () => window.alert('初始化账单类型失败')
  );
};

const initSyncBillsToLocalStorageHook = () => {
  bills$.observe(bills =>
    setTimeout(
      () =>
        localStorage.setItem(LOCAL_StORAGE_KEY_BILLS, JSON.stringify(bills)),
      0
    )
  );
};

const initTimeInputValue = () => {
  timeInputElm.value = new Date().toISOString().slice(0, 16);
};

const renderElms = () => {
  render(categorySelectorInnerHTML$, categorySelectorElm);
  render(totalSummaryHTML$, totalSummaryElm);
  render(billListHTML$, billListElm);
  render(categorizedSummaryHTML$, categorizedSummaryElm);
  render(categoryInputInnerHTML$, categoryInputElm);
};

const main = () => {
  renderElms();
  addListeners();
  initCategories();
  initTimeInputValue();
  initSyncBillsToLocalStorageHook();
};

main();
