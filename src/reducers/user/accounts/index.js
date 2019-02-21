import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, resourceType, collection } = action;

  if (
    type === actionTypes.RESOURCE.RECEIVED_COLLECTION &&
    (resourceType === 'ashares' || resourceType === 'shared/ashares')
  ) {
    return collection ? [...collection] : [];
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

export function accountSummary(state) {
  const shared = sharedAccounts(state);

  if (!shared || !shared.length) {
    return [];
  }

  const accounts = [];

  shared.forEach(a => {
    if (a.sandbox) {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: `${a.company} - Production`,
      });
      accounts.push({
        id: a.id,
        environment: 'sandbox',
        label: `${a.company} - Sandbox`,
      });
    } else {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: a.company,
      });
    }
  });

  return accounts;
}
// #endregion
