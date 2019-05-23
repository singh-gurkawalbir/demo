import actionTypes from '../../../actions/types';

export default (
  state = { netsuite: { webservices: {}, suitescript: {} }, salesforce: {} },
  action
) => {
  const {
    type,
    resource,
    connectionId,
    resourceType,
    netsuiteSpecificResource,
  } = action;
  let newState;

  switch (type) {
    // This is quiet a deep object...ensuring i am creating
    // new instances all the way to the children of the object.
    // This is to ensure that a react component listening
    // to just the root of the object realizes they are updates to
    // the children and subsequently rerenders.
    case actionTypes.RECEIVED_NETSUITE_COLLECTION: {
      newState = Object.assign({}, state.netsuite);
      newState[netsuiteSpecificResource] = Object.assign(
        {},
        state.netsuite[netsuiteSpecificResource]
      );
      const specificResource = newState[netsuiteSpecificResource];

      specificResource[connectionId] = {
        ...specificResource[connectionId],
        [resourceType]: resource,
      };

      return { ...state, ...{ netsuite: newState } };
    }

    default:
      return state;
  }
};

export const metadataCollection = (
  state,
  connectionId,
  applicationType,
  resourceType,
  netsuiteSpecificResource
) => {
  const applicationResource = (state && state[applicationType]) || null;

  if (applicationType === 'netsuite') {
    return (
      (applicationResource &&
        applicationResource[netsuiteSpecificResource] &&
        applicationResource[netsuiteSpecificResource][connectionId] &&
        applicationResource[netsuiteSpecificResource][connectionId][
          resourceType
        ]) ||
      null
    );
  }

  return (
    (applicationResource &&
      applicationResource[connectionId] &&
      applicationResource[connectionId][resourceType]) ||
    null
  );
};
