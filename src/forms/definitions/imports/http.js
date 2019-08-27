export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'http.body') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'http.lookups'
      );

      if (recordTypeField) {
        return {
          lookups: {
            fieldId: recordTypeField.fieldId,
            data: recordTypeField && recordTypeField.value,
          },
        };
      }
    }

    return null;
  },
  fields: [
    { formId: 'common' },
    { fieldId: 'http.advanceOption' },
    { fieldId: 'http.childRecords' },
    { fieldId: 'http.method' },
    { fieldId: 'http.headers' },
    { fieldId: 'http.requestMediaType' },
    { fieldId: 'http.compositeType' },
    { fieldId: 'http.compositeMethod' },
    { fieldId: 'http.lookups', visible: false },
    { fieldId: 'http.body' },
    { fieldId: 'http.relativeUri' },
    { fieldId: 'http.successPath' },
    { fieldId: 'http.successValues' },
    { fieldId: 'http.responseIdPath' },
    { fieldId: 'http.responsePath' },
    { fieldId: 'http.errorPath' },
    { fieldId: 'http.batchSizeLimit' },
    { fieldId: 'http.compositeMethodUpdate' },

    { fieldId: 'http.relativeUriUpdate' },

    { fieldId: 'http.responseIdPathUpdate' },
    { fieldId: 'http.responsePathUpdate' },
    { fieldId: 'http.existingDataId' },
    { fieldId: 'http.successMediaType' },
    { fieldId: 'http.errorMediaType' },
    { fieldId: 'http.sampleFile' },
    { fieldId: 'http.columnDelimiter' },
    { fieldId: 'http.includeHeader' },
    { fieldId: 'http.customHeaderRows' },
    { fieldId: 'http.advanceOptionMapping' },
    { fieldId: 'http.childRecordsMapping' },
    { fieldId: 'http.rowDelimiter' },
    { fieldId: 'http.replaceTabWithSpace' },
    { fieldId: 'http.replaceNewLineWithSpace' },
    { fieldId: 'http.ignoreEmptyNodes' },
    { fieldId: 'http.concurrencyIdLockTemplate' },
    { fieldId: 'http.dataUriTemplate' },
    { fieldId: 'http.configureAsyncHelper' },
    // { fieldId: 'http.lookups[*].body' },
    // { fieldId: 'http.lookups[*].default' },
    // { fieldId: 'http.lookups[*].extract' },
    // { fieldId: 'http.lookups[*].map' },
    // { fieldId: 'http.lookups[*].method' },
    // { fieldId: 'http.lookups[*].name' },
    // { fieldId: 'http.lookups[*].relativeURI' },
    { fieldId: 'hookType' },
    { fieldId: 'hooks.preMap.function' },
    { fieldId: 'hooks.preMap._scriptId' },
    { fieldId: 'hooks.preMap._stackId' },
    { fieldId: 'hooks.postMap.function' },
    { fieldId: 'hooks.postMap._scriptId' },
    { fieldId: 'hooks.postMap._stackId' },
    { fieldId: 'hooks.postSubmit.function' },
    { fieldId: 'hooks.postSubmit._scriptId' },
    { fieldId: 'hooks.postSubmit._stackId' },
    { fieldId: 'hooks.postAggregate.function' },
    { fieldId: 'hooks.postAggregate._scriptId' },
    { fieldId: 'hooks.postAggregate._stackId' },
  ],
  fieldSets: [],
};
