import RestMetaData from '../rest';

/* FTP meta data is same as REST Metadata except it doesnt have immutable field
 */
export default {
  getMetaData: (options = {}) => {
    const restMetadata = RestMetaData.getMetaData(options);
    // get ftpFieldMap by removing immutable field
    const { immutable, ...ftpFieldMap } = restMetadata.fieldMap;
    // remove immutable from layout fields
    const ftpLayoutFields = restMetadata.layout.fields.filter(
      field => field !== 'immutable'
    );
    const ftpMetaData = {
      fieldMap: ftpFieldMap,
      layout: {
        fields: ftpLayoutFields,
      },
      optionsHandler: restMetadata.optionsHandler,
    };

    return ftpMetaData;
  },
};
