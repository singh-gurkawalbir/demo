import { isString } from 'lodash';
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
    const filterValue = options.rule || value;
    let rule = [];

    if (isString(filterValue)) {
      try {
        rule = JSON.parse(filterValue);
      } catch (e) {
      // do nothing
      }
    } else {
      rule = filterValue || [];
    }

    return {
      ...options,
      rule,
    };
  },
  buildData: (editor, sampleData) => {
    const {wrapData} = editor || {};
    let formattedData = safeParse(sampleData);

    if (sampleData && !wrapData) {
      const extractPaths = getJSONPaths(pickFirstObject(safeParse(sampleData)));

      formattedData =
          extractPaths?.map(obj => ({ name: obj.id, id: obj.id })) || [];
    }
    const modifiedData = Array.isArray(formattedData) ? formattedData.map(wrapSpecialChars) : formattedData;

    return modifiedData;
  },
};

