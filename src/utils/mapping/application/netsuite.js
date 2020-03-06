import { uniqBy } from 'lodash';

const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
const wrapTextForSpecialCharsNetsuite = extract => {
  let toReturn = extract;

  if (
    extract.indexOf('[*].') === -1 &&
    extract.indexOf("'") === -1 &&
    extract.indexOf('.') === -1 &&
    /\W/.test(extract)
  ) {
    toReturn = `['${extract}']`;
  }

  return toReturn;
};

export default {
  // TODO (Aditya): Pass recordType after exports are completed and test for it
  getFieldsAndListMappings: ({
    mappings = {},
    recordType,
    isGroupedSampleData,
  }) => {
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
        if (mapping.generate !== 'celigo_initializeValues') {
          const tempFm = { ...mapping };

          tempFm.useAsAnInitializeValue =
            initializeValues.indexOf(tempFm.generate) > -1;

          if (mapping.internalId) {
            tempFm.generate += '.internalid';
          } else if (isItemSubtypeRecord && mapping.generate === 'subtype') {
            tempFm.internalId = true;
            tempFm.generate += '.internalid';
          }

          if (/^\['.*']$/.test(tempFm.extract)) {
            // Remove [' in the start and  remove '] in the end
            tempFm.extract = tempFm.extract.replace(/^(\[')(.*)('])$/, '$2');
          }

          if (
            mapping.subRecordMapping &&
            mapping.subRecordMapping.recordType &&
            mapping.generate === 'celigo_initializeValues'
          ) {
            tempFm.extract = 'Subrecord Mapping';
            tempFm.isSubRecordMapping = true;
          }

          toReturn.push(tempFm);
        }
      });
    mappings.lists &&
      mappings.lists.forEach(lm => {
        lm.fields.forEach(fm => {
          const tempFm = { ...fm };

          tempFm.generate = [lm.generate, tempFm.generate].join('[*].');

          if (fm.internalId) {
            tempFm.generate += '.internalid';
          }

          if (/^\['.*']$/.test(tempFm.extract)) {
            // if extract starts with [' and ends with ']
            tempFm.extract = tempFm.extract.replace(/^(\[')(.*)('])$/, '$2'); // removing [' and '] at begining and end of extract that we added
          } else if (
            /^(\*|0)\.\['.*']$/.test(tempFm.extract) &&
            isGroupedSampleData
          ) {
            // if it starts with *.[' and ends with '] or starts with 0.[' and ends with ']
            // just remove [' and '] in extract *. will be removed in next step and will set useFirstRow accordingly
            tempFm.extract = tempFm.extract.replace(
              /^([*|0]\.)(\[')(.*)('])$/,
              '$1$3'
            );
          }

          if (isGroupedSampleData) {
            if (tempFm.extract && tempFm.extract.indexOf('*.') === 0) {
              tempFm.extract = tempFm.extract.substr('*.'.length);
            } else {
              // remove 0. in the begining of extract
              if (tempFm.extract && /^0\./.test(tempFm.extract)) {
                tempFm.extract = tempFm.extract.substr('0.'.length);
              }

              tempFm.useFirstRow = true;
            }
          }

          if (fm.subRecordMapping && fm.subRecordMapping.recordType) {
            tempFm.extract = 'Subrecord Mapping';
            tempFm.isSubRecordMapping = true;
          }

          toReturn.push(tempFm);
        });
      });

    // removing duplicate items if present
    const _toReturn = uniqBy(toReturn, item => item.generate);

    return _toReturn;
  },

  generateMappingFieldsAndList: ({
    mappings,
    isGroupedSampleData,
    generateFields,
    recordType,
    flowSampleData,
  }) => {
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
        }

        if (
          flowSampleData &&
          isGroupedSampleData &&
          mapping.extract &&
          mapping.extract.indexOf('[*].') === -1 &&
          !handlebarRegex.test(mapping.extract)
        ) {
          if (!mapping.useFirstRow) {
            // Adding *. prefix to extract
            mapping.extract = `*.${mapping.extract}`;
          } else {
            // Adding *. prefix to extract when useFirstRow is checked
            mapping.extract = `0.${mapping.extract}`;
          }
        }
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

      const fieldMetadata =
        generateFields &&
        generateFields.find(generate => generate.id === mappingTmp.generate);

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

      if (
        mapping.extract &&
        mapping.extract.indexOf('[*].') === -1 &&
        mapping.extract.indexOf("'") === -1 &&
        !handlebarRegex.test(mapping.extract)
      ) {
        if (/^(0|\*)\./.test(mapping.extract)) {
          // extract is mapped to sublist
          if (!mapping.useFirstRow) {
            mapping.extract = `*.${wrapTextForSpecialCharsNetsuite(
              mapping.extract.slice(2)
            )}`;
          } else {
            mapping.extract = `0.${wrapTextForSpecialCharsNetsuite(
              mapping.extract.slice(2)
            )}`;
          }
        } else {
          mapping.extract = `${wrapTextForSpecialCharsNetsuite(
            mapping.extract
          )}`;
        }
      }

      delete mapping.useFirstRow;
      // key is property added in UI side. removing it while saving.
      delete mapping.key;

      if (mapping.useAsAnInitializeValue) {
        initializeValues.push(mapping.generate);
        delete mapping.useAsAnInitializeValue;
      }

      // in case of subrecord mapping delete properties added in UI side
      if (mapping.isSubRecordMapping) {
        delete mapping.extract;
        delete mapping.isSubRecordMapping;
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
