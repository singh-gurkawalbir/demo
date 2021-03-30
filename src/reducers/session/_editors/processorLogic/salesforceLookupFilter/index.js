import getJSONPaths, { pickFirstObject, wrapSpecialChars } from '../../../../../utils/jsonPaths';
import { safeParse } from '../../../../../utils/string';

export default {
  /**
     * There is no support yet for salesforceLookupFilter processor in backend.
     * We need to update this appropriately once the backend is enhanced.
     */
  requestBody: () => ({}),
  validate: () => ({
    dataError: '',
  }),
  init: props => {
    const {options, fieldState} = props;
    const {value} = fieldState || {};

    return {
      ...options,
      rule: value,
    };
  },
  buildData: (_, sampleData) => {
    let formattedData = [];

    if (sampleData) {
      const extractPaths = getJSONPaths(
        pickFirstObject(safeParse(sampleData), null, {
          wrapSpecialChars: true,
        })
      );

      formattedData = extractPaths?.map(obj => ({ name: obj.id, id: obj.id.replace('[*].', '(*).') })) || [];
    }
    let modifiedData = Array.isArray(formattedData) ? formattedData.map(wrapSpecialChars) : formattedData;

    if (Array.isArray(formattedData)) {
      modifiedData = modifiedData.concat(
        modifiedData.map(i => ({ name: `*.${i.name}`, id: `*.${i.id}` }))
      );
    }

    return modifiedData;
  },
};

