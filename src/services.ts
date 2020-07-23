import {Category, StringifiedCategory} from './helpers';
import {parseCsvText} from './utils';

// 这里mock下这个csv, 生产环境中应当是服务器端的动态资源
export const MOCK_CATEGORIES_CSV = `id,type,name
1bcddudhmh,0,车贷
hc5g66kviq,0,车辆保养
8s0p77c323,0,房贷
0fnhbcle6hg,0,房屋租赁
odrjk823mj8,0,家庭用品
bsn20th0k2o,0,交通
j1h1nohhmmo,0,旅游
3tqndrjqgrg,0,日常饮食
s73ijpispio,1,工资
1vjj47vpd28,1,股票投资
5il79e11628,1,基金投资`;

export const getCategoriesCsv = async (): Promise<Category[]> => {
  const stringifiedCategories = parseCsvText<StringifiedCategory>(
    MOCK_CATEGORIES_CSV
  );
  const categories = stringifiedCategories.map(
    (origin: StringifiedCategory) => ({
      type: Number(origin.type),
      id: origin.id,
      name: origin.name,
    })
  );
  return categories;
};
