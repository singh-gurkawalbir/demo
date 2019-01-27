import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, resourceType, collection } = action;

  if (
    type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
    resourceType === 'ashares'
  ) {
    return [...collection];
  }

  return state;
};

// #region PUBLIC SELECTORS
export function sharedAccounts(state) {
  if (!state) {
    return null;
  }

  const accepted = state.filter(a => a.accepted);
  const shared = [];

  accepted.forEach(a => {
    if (!a.ownerUser) return;

    const ioLicenses = a.ownerUser.licenses.find(l => l.type === 'integrator');
    const sandbox = ioLicenses && ioLicenses.sandbox;

    shared.push({
      id: a._id,
      company: a.ownerUser.company,
      email: a.ownerUser.email,
      sandbox,
    });
  });

  return shared;
}

// This is a representation of the accounts likely used for selecting
// not only account, but also environment. An item is made for each
// account/envirinment combo, so if an account has a sandbox, then it
// will result in 2 items in this collection.
// TODO: find out how the preferences differentiate between prod/sandbox.
// are there 2 preferences? or is the valiue a compound key?
// the shape of the item in this set may likely change.
// We probably don't need id and key
export function accountSummary(state) {
  const shared = sharedAccounts(state);

  if (!shared || shared.length === 0) {
    return [];
  }

  const accounts = [];

  shared.forEach(a => {
    if (a.sandbox) {
      accounts.push({
        id: a.id,
        key: a.id,
        label: `${a.company} - Production`,
      });
      accounts.push({
        id: a.id,
        key: `${a.id}-sb`,
        label: `${a.company} - Sandbox`,
        sandbox: true,
      });
    } else {
      accounts.push({
        id: a.id,
        key: a.id,
        label: a.company,
      });
    }
  });

  // TODO: This is temporary until Surya's PR is merged so we can set
  // the seleted flag based off the current account stored in the preferences.
  accounts[accounts.length - 1].selected = true;

  return accounts;
}
// #endregion
