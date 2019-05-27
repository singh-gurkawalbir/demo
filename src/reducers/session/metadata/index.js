import actionTypes from '../../../actions/types';

export default (
  state = { netsuite: { webservices: {}, suitescript: {} }, salesforce: {} },
  action
) => {
  const { type, resource, connectionId, resourceType, mode } = action;
  let newState;

  switch (type) {
    // This is quiet a deep object...ensuring i am creating
    // new instances all the way to the children of the object.
    // This is to ensure that a react component listening
    // to just the root of the object realizes they are updates to
    // the children and subsequently rerenders.
    case actionTypes.RECEIVED_NETSUITE_COLLECTION: {
      newState = { ...state.netsuite };
      newState[mode] = { ...state.netsuite[mode] };
      const specificResource = newState[mode];

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
  mode
) => {
  const applicationResource = (state && state[applicationType]) || null;

  if (applicationType === 'netsuite') {
    return (
      (applicationResource &&
        applicationResource[mode] &&
        applicationResource[mode][connectionId] &&
        applicationResource[mode][connectionId][resourceType]) ||
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
