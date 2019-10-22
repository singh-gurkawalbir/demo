export default {
  // TODO (Aditya): Pass recordType after exports are completed and test for it
  getFieldsAndListMappings: ({ mappings = {}, recordType }) => {
    const toReturn = [];
    let isItemSubtypeRecord = false;

    isItemSubtypeRecord =
      ['noninventoryitem', 'otherchargeitem', 'serviceitem'].indexOf(
        recordType
      ) > -1;
    let initializeValues = [];
    const fmInitializeValues =
      mappings.fields &&
      mappings.fields.find(
        mapping => mapping.generate === 'celigo_initializeValues'
      );

    if (fmInitializeValues && fmInitializeValues.hardCodedValue) {
      initializeValues = fmInitializeValues.hardCodedValue.split(',');
    }

    mappings.fields &&
      mappings.fields.forEach(mapping => {
        if (
          !(mapping.subRecordMapping && mapping.subRecordMapping.recordType) &&
          mapping.generate !== 'celigo_initializeValues'
        ) {
          const tempFm = { ...mapping };

          tempFm.useAsAnInitializeValue =
            initializeValues.indexOf(tempFm.generate) > -1;

          if (mapping.internalId) {
            tempFm.generate += '.internalid';
          } else if (isItemSubtypeRecord && mapping.generate === 'subtype') {
            tempFm.internalId = true;
            tempFm.generate += '.internalid';
          }

          // TODO (Aditya): handling special characters in extracts of FTP Export
          toReturn.push(tempFm);
        }
      });
    mappings.lists &&
      mappings.lists.forEach(lm => {
        lm.fields.forEach(fm => {
          if (!(fm.subRecordMapping && fm.subRecordMapping.recordType)) {
            const tempFm = { ...fm };

            tempFm.generate = [lm.generate, tempFm.generate].join('[*].');

            if (fm.internalId) {
              tempFm.generate += '.internalid';
            }

            // TODO (Aditya): handling special characters in extracts of FTP Export
            // TODO (Aditya): check for useFirstRowCheckBoxCheck after export is ready
            toReturn.push(tempFm);
          }
        });
      });

    return toReturn;
  },

  generateMappingFieldsAndList: ({ mappings, generateFields, recordType }) => {
    const initializeValues = [];
    let generateParts;
    const lists = [];
    const fields = [];
    let generateListPath;
    let isItemSubtypeRecord = false;

    isItemSubtypeRecord =
      ['noninventoryitem', 'otherchargeitem', 'serviceitem'].indexOf(
        recordType
      ) > -1;
    mappings.forEach(mappingTmp => {
      const mapping = { ...mappingTmp };

      if (!mapping.generate) {
        return true;
      }

      generateParts = mapping.generate ? mapping.generate.split('[*].') : null;
      let list;

      if (generateParts && generateParts.length > 1) {
        mapping.generate = generateParts.pop();
        generateListPath = generateParts.join('.');

        list = lists.find(l => l.generate === generateListPath);

        if (!list) {
          list = {
            generate: generateListPath,
            fields: [],
          };
          lists.push(list);

          // if (existingListsData[generateListPath]) {
          //   list.jsonPath = existingListsData[generateListPath].jsonPath;
          // }
        }
        // TODO (Aditya): Extract field
      }

      generateParts = mapping.generate.split('.');
      const generate = generateParts[0];

      mapping.generate = generate;

      if (
        generateParts.length > 1 &&
        !(isItemSubtypeRecord && generateParts[0] === 'subtype')
      ) {
        if (generateParts[1] === 'internalid') {
          mapping.internalId = true;
        } else {
          // temp _billing_addressbook and _shipping_addressbook fields
          mapping.generate = generateParts.join('.');
        }
      } else {
        mapping.internalId = false;
      }

      const fieldMetadata = generateFields.find(
        generate => generate.id === mappingTmp.generate
      );

      // TODO (Aditya): Check for below object type comparison
      if (
        fieldMetadata &&
        fieldMetadata.type === 'multiselect' &&
        mapping.hardCodedValue &&
        !mapping.internalId &&
        Object.prototype.toString.apply(mapping.hardCodedValue) ===
          '[object String]'
      ) {
        mapping.hardCodedValue = mapping.hardCodedValue.split(',');
      }

      if (mapping.useAsAnInitializeValue) {
        initializeValues.push(mapping.generate);
      }

      if (
        mapping.generate === 'celigo_recordmode_dynamic' &&
        (mapping.hardCodedValue || mapping.hardCodedValue === false)
      ) {
        if (
          mapping.hardCodedValue === true ||
          mapping.hardCodedValue === 'true'
        ) {
          list ? list.fields.push(mapping) : fields.push(mapping);
        }
      } else {
        list ? list.fields.push(mapping) : fields.push(mapping);
      }

      // TODO (Aditya) handling special characters in extracts of FTP Export
      // initialValues.push(mapping.generate);
      // formattedMapping;
    });

    if (initializeValues.length > 0) {
      fields.push({
        generate: 'celigo_initializeValues',
        hardCodedValue: initializeValues.join(','),
      });
    }

    const formattedMapping = {
      fields,
      lists,
    };

    // TODO (Aditya): handle Subrecord Imports
    return formattedMapping;
  },
};
