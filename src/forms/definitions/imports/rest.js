export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'rest.mapping') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'rest.lookups'
      );

      if (recordTypeField) {
        return {
          lookups: {
            // passing lookupId fieldId and data since for modifying lookups inside
            //  Mapping page
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
    { fieldId: 'rest.method' },
    { fieldId: 'rest.headers' },
    { fieldId: 'rest.requestMediaType' },
    { fieldId: 'rest.compositeType' },
    { fieldId: 'rest.compositeMethod' },
    { fieldId: 'mapping' },
    { fieldId: 'rest.relativeUri' },
    { fieldId: 'rest.successPath' },
    { fieldId: 'rest.successValues' },
    { fieldId: 'rest.responseIdPath' },
    { fieldId: 'rest.compositeMethodUpdate' },
    { fieldId: 'rest.relativeUriUpdate' },
    { fieldId: 'rest.responseIdPathUpdate' },
    { fieldId: 'rest.existingDataId' },
    { fieldId: 'rest.advanceOptionMapping' },
    { fieldId: 'rest.childRecordsMapping' },
    { fieldId: 'rest.concurrencyIdLockTemplate' },
    { fieldId: 'rest.dataUriTemplate' },
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
