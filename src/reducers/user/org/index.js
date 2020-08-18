import { selectors as fromUsers } from './users';
import { selectors as fromAccounts } from './accounts';
import { genSelectors } from '../../util';

export const selectors = {};
const subSelectors = {
  users: fromUsers,
  accounts: fromAccounts,
};

genSelectors(selectors, subSelectors);
