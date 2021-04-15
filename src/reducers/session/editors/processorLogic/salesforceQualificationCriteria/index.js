export default {
  /**
     * TODO
     * There is no support yet for salesforce qualification criteria processor in backend.
     * We need to update this appropriately once the backend is enhanced.
     */
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  init: props => {
    const {options, fieldState} = props;
    const {value, connectionId} = fieldState || {};

    return {
      ...options,
      rule: value,
      connectionId,
      sObjectType: fieldState.options?.sObjectType,
    };
  },
};

