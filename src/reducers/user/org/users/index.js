import actionTypes from '../../../../actions/types';

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
  if (!state || !state.shared) {
    return null;
  }

  const accepted = state.shared.filter(a => a.accepted);
  const shared = [];

  accepted.forEach(a => {
    if (!a.ownerUser) return;

    const ioLicenses = a.ownerUser.licenses.find(l => l.type === 'integrator');
    const sandbox = ioLicenses && ioLicenses.sandbox;
    const accessLevel = a.accessLevel || 'monitor';

    shared.push({
      id: a._id,
      company: a.ownerUser.company,
      email: a.ownerUser.email,
      sandbox,
      accessLevel,
    });
  });

  return shared;
}

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
        environment: 'production',
        label: `${a.company} - Production`,
        accessLevel: a.accessLevel,
      });
      accounts.push({
        id: a.id,
        environment: 'sandbox',
        label: `${a.company} - Sandbox`,
        accessLevel: a.accessLevel,
      });
    } else {
      accounts.push({
        id: a.id,
        environment: 'production',
        label: a.company,
        accessLevel: a.accessLevel,
      });
    }
  });

  return accounts;
}

export function notifications(state) {
  const accounts = [];

  if (!state || !state.shared || !state.shared.length) {
    return accounts;
  }

  const pending = state.shared.filter(
    a => !a.accepted && !a.dismissed && !a.disabled
  );

  pending.forEach(a => {
    accounts.push({
      id: a._id,
      label: a.ownerUser ? a.ownerUser.company || a.ownerUser.name : a._id,
      accessLevel: a.accessLevel,
    });
  });

  return accounts;
}
// #endregion
