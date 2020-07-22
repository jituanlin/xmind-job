import {replace} from './utils';

test('replace', () => expect(replace([1, 2], 0, -1)).toEqual([-1, 2]));
