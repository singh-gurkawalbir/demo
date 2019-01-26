import actionTypes from '../../actions/types';

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
  // console.log('fetch', resourceType, id);

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
// #endregion
