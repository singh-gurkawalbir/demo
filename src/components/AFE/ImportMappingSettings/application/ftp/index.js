import RestMetaData from '../rest';

/* FTP meta data is same as REST Metadata except it doesnt have immutable field
 */
export default {
  getMetaData: (options = {}) => {
    const restMetaData = RestMetaData.getMetaData(options);
    // get ftpFieldMap by removing immutable field
    const { immutable, ...ftpFieldMap } = restMetaData.fieldMap;
    // remove immutable from layout fields
    const ftpLayoutFields = restMetaData.layout.fields.filter(
      field => field !== 'immutable'
    );
    const ftpMetaData = {
      fieldMap: ftpFieldMap,
      layout: {
        fields: ftpLayoutFields,
      },
      optionsHandler: restMetaData.optionsHandler,
    };

    return ftpMetaData;
  },
};
