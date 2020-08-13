import { selectors as fromUsers } from './users';
import { selectors as fromAccounts } from './accounts';
import { genSelectors } from '../../util';

// eslint-disable-next-line import/prefer-default-export
export const selectors = {};
const subSelectors = {
  users: fromUsers,
  accounts: fromAccounts,
};

genSelectors(selectors, subSelectors);
