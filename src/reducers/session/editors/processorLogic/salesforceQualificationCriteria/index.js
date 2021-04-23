export default {
  /**
     * There is no support yet for salesforce qualification criteria processor in backend.
     * We need to update this appropriately once the backend is enhanced.
     */
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  init: props => {
    const {options, fieldState} = props;

    return {
      ...options,
      rule: fieldState?.value,
    };
  },
};

