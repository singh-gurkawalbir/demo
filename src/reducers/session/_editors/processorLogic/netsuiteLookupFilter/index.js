import getJSONPaths, { pickFirstObject, wrapSpecialChars } from '../../../../../utils/jsonPaths';
import { safeParse } from '../../../../../utils/string';

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
    const {value} = fieldState || {};
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
  buildData: ({ssLinkedConnectionId}, sampleData) => {
    let formattedData = safeParse(sampleData);

    if (sampleData && !ssLinkedConnectionId) {
      const extractPaths = getJSONPaths(pickFirstObject(safeParse(sampleData)));

      formattedData =
          extractPaths?.map(obj => ({ name: obj.id, id: obj.id })) || [];
    }
    const modifiedData = Array.isArray(formattedData) ? formattedData.map(wrapSpecialChars) : formattedData;

    return modifiedData;
  },
};

