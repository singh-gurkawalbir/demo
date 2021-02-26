import getJSONPaths, { pickFirstObject, wrapSpecialChars } from '../../../../../utils/jsonPaths';

export default {
  /**
     * There is no support yet for netsuiteLookupFilter processor in backend.
     * We need to update this appropriately once the backend is enhanced.
     */
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  init: props => {
    const {options, fieldState} = props;
    const {value} = fieldState;
    let rule = [];

    if (value) {
      try {
        rule = JSON.parse(value);
      } catch (e) {
      // do nothing
      }
    }

    return {
      ...options,
      rule,
    };
  },
  buildData: (_, sampleData) => {
    let formattedData = [];

    if (sampleData) {
      const extractPaths = getJSONPaths(pickFirstObject(sampleData));

      formattedData =
          extractPaths?.map(obj => ({ name: obj.id, id: obj.id })) || [];
    }
    const modifiedData = formattedData.map(wrapSpecialChars);

    return modifiedData;
  },
};

