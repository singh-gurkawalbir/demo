import { uniqBy } from 'lodash';
import Browser from 'bowser';
import mappingUtil, {handlebarRegex} from '..';

const wrapTextForSpecialCharsNetsuite = (extract, isSS2) => {
  let toReturn = extract;
  const isExtractAlreadyWrappedByUser = /^\[.*\]$/.test(extract) && // If extract is wrapped in square braces i,e starts with [ and ends with ]
  /\W/.test(extract.replace(/^\[|]$/g, '')) && // and the wrapped content contains special character
  !/\./.test(extract.replace(/^\[|]$/g, '')); // and none of the special characters is a dot

  if (
    extract.indexOf('[*].') === -1 &&
    !isExtractAlreadyWrappedByUser &&
    extract.indexOf("'") === -1 &&
    extract.indexOf('.') === -1 &&
    /\W/.test(extract)
  ) {
    toReturn = isSS2 ? `[${extract}]` : `['${extract}']`;
  }

  return toReturn;
};

export default {
  // TODO (Aditya): Pass recordType after exports are completed and test for it
  getFieldsAndListMappings: ({
    mappings = {},
    recordType,
    isGroupedSampleData,
    isPreviewSuccess,
    resource,
  }) => {
    let toReturn = [];
    // eslint-disable-next-line camelcase
    let isItemSubtypeRecord = false;

    isItemSubtypeRecord =
      ['noninventoryitem', 'otherchargeitem', 'serviceitem'].indexOf(
        recordType
      ) > -1;
    let initializeValues = [];
    const fmInitializeValues =
      mappings.fields?.find(
        mapping => mapping.generate === 'celigo_initializeValues'
      );

    if (fmInitializeValues?.hardCodedValue) {
      initializeValues = fmInitializeValues.hardCodedValue.split(',');
    }

      mappings.fields?.forEach(mapping => {
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

          if (/^\['.*']$/.test(tempFm.extract) && !/^\['".*"']$/.test(tempFm.extract)) {
            // Remove [' in the start and  remove '] in the end
            tempFm.extract = tempFm.extract.replace(/^(\[')(.*)('])$/, '$2');
          } else if (/^\[.*]$/.test(tempFm.extract) && !/^\[".*"]$/.test(tempFm.extract) && /\W/.test(tempFm.extract.replace(/^\[|]$/g, ''))) {
            // If extract is wrapped with [ and ] and the wrapped content has a special character then
            // Remove [ in the start and  remove ] in the end in case of SS 2.0 imports
            tempFm.extract = tempFm.extract.replace(/^(\[)(.*)(])$/, '$2');
          }

          if (
            mapping.subRecordMapping?.recordType
          ) {
            tempFm.extract = 'Subrecord Mapping';
            tempFm.isSubRecordMapping = true;
          }

          toReturn.push(tempFm);
        }
      });
      let index;
      let isPrevOperationAttachOrDetach = false;

      // eslint-disable-next-line camelcase
      if (resource?.netsuite_da?.operation === 'attach' || resource?.netsuite_da?.operation === 'detach') {
        index = toReturn.findIndex(
          mapping => (mapping.generate === 'celigo_nlobjAttachToId' || mapping.generate === 'celigo_nlobjDetachFromId')
        );
        if (index >= 0) { isPrevOperationAttachOrDetach = true; }
      }

      // eslint-disable-next-line camelcase
      if (resource?.netsuite_da?.operation === 'attach') {
        toReturn = toReturn.filter(m => (!['celigo_nlobjDetachFromId', 'celigo_nlobjDetachedType', 'celigo_nlobjDetachedId'].includes(m.generate)));

        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjAttachToId'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjAttachToId',
            isRequired: true,
          });
        } else {
          toReturn[index].isRequired = true;
        }

        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjAttachedType'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjAttachedType',
            isRequired: true,
          });
        } else {
          toReturn[index].isRequired = true;
        }

        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjAttachedId'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjAttachedId',
            isRequired: true,
          });
        } else {
          toReturn[index].isRequired = true;
        }
      // eslint-disable-next-line camelcase
      } else if (resource?.netsuite_da?.operation === 'detach') {
        toReturn = toReturn.filter(m => (!['celigo_nlobjAttachToId', 'celigo_nlobjAttachedType', 'celigo_nlobjAttachedId'].includes(m.generate)));
        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjDetachFromId'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjDetachFromId',
            isRequired: true,
          });
        } else {
          toReturn[index].isRequired = true;
        }

        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjDetachedType'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjDetachedType',
            isRequired: true,
          });
        } else {
          toReturn[index].isRequired = true;
        }

        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjDetachedId'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjDetachedId',
            isRequired: true,
          });
        } else {
          toReturn[index].isRequired = true;
        }
      }

      if (['attach', 'detach'].includes(resource && resource.netsuite_da?.operation) && !isPrevOperationAttachOrDetach) {
        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjAttachDetachAttributesRole'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjAttachDetachAttributesRole',
          });
        }

        index = toReturn.findIndex(
          mapping => mapping.generate === 'celigo_nlobjAttachDetachAttributesField'
        );
        if (index === -1) {
          toReturn.push({
            generate: 'celigo_nlobjAttachDetachAttributesField',
          });
        }
      }
      mappings.lists?.forEach(lm => {
        lm.fields.forEach(fm => {
          const tempFm = { ...fm };

          tempFm.generate = [lm.generate, tempFm.generate].join('[*].');

          if (fm.internalId) {
            tempFm.generate += '.internalid';
          }

          // If no sample data found, and extract starts with *. or 0. example *.abc or 0.abc, then assume export is grouped data.
          if (!isPreviewSuccess && /^(0|\*)\./.test(tempFm.extract)) {
            tempFm.useIterativeRow = true;
          }

          if (/^\['.*']$/.test(tempFm.extract)) {
            // if extract starts with [' and ends with ']
            tempFm.extract = tempFm.extract.replace(/^(\[')(.*)('])$/, '$2'); // removing [' and '] at begining and end of extract that we added
          } else if (/^\[.*]$/.test(tempFm.extract) && /\W/.test(tempFm.extract.replace(/^\[|]$/g, ''))) {
            // If extract is wrapped with [ and ] and the wrapped ccontent contains any  special character then
          // if extract starts with [ and ends with ] for a SS2.0 import
            tempFm.extract = tempFm.extract.replace(/^(\[)(.*)(])$/, '$2'); // removing [ and ] at begining and end of extract that we added
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
          } else if (
            /^(\*|0)\.\[.*]$/.test(tempFm.extract) &&
            /\W/.test(tempFm.extract.replace(/^([*|0]\.)(\[)(.*)(])$/, '$3')) &&
            isGroupedSampleData
          ) {
            // if import is SS2.0 and  it starts with *.[ and ends with ] or starts with 0.[ and ends with ]
            // just remove [ and ] in extract *. will be removed in next step and will set useFirstRow accordingly
            tempFm.extract = tempFm.extract.replace(
              /^([*|0]\.)(\[)(.*)(])$/,
              '$1$3'
            );
          }

          if (isGroupedSampleData && tempFm.extract?.indexOf('*.') !== 0) {
            tempFm.useFirstRow = true;
          }
          if (tempFm.extract?.indexOf('*.') === 0) {
            tempFm.extract = tempFm.extract.substr('*.'.length);
          } else if (tempFm.extract && /^0\./.test(tempFm.extract)) {
            tempFm.extract = tempFm.extract.substr('0.'.length);
          }

          if (/^\['.*']$/.test(tempFm.extract)) {
            // Remove [' in the start and  remove '] in the end
            tempFm.extract = tempFm.extract.replace(/^(\[')(.*)('])$/, '$2');
          } else if (/^\[.*]$/.test(tempFm.extract) && /\W/.test(tempFm.extract.replace(/^\[|]$/g, ''))) {
            // if SS2.0 then Remove [ in the start and  remove ] in the end
            tempFm.extract = tempFm.extract.replace(/^(\[)(.*)(])$/, '$2');
          }

          if (fm.subRecordMapping?.recordType) {
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
    importResource,
  }) => {
    const initializeValues = [];
    let generateParts;
    const lists = [];
    const fields = [];
    // eslint-disable-next-line camelcase
    const isSS2 = !!(importResource?.netsuite_da?.restletVersion === 'suiteapp2.0' || importResource?.netsuite_da?.useSS2Restlets);
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

      if (generateParts?.length > 1) {
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
          (isGroupedSampleData || mapping.useIterativeRow) &&
          mapping.extract?.indexOf('[*].') === -1 &&
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
        generateFields?.find(generate => generate.id === mappingTmp.generate);

      // TODO (Aditya): Check for below object type comparison
      if (
        fieldMetadata?.type === 'multiselect' &&
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
              mapping.extract.slice(2),
              isSS2
            )}`;
          } else {
            mapping.extract = `0.${wrapTextForSpecialCharsNetsuite(
              mapping.extract.slice(2),
              isSS2
            )}`;
          }
        } else {
          mapping.extract = `${wrapTextForSpecialCharsNetsuite(
            mapping.extract,
            isSS2
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

    // adding one more check to know if celigo_inititalizeValues is present or not
    if (initializeValues.length > 0 && !fields.find(f => f.generate === 'celigo_initializeValues')) {
      fields.push({
        generate: 'celigo_initializeValues',
        hardCodedValue: initializeValues.join(','),
      });
    }

    const generatedMapping = mappingUtil.shiftSubRecordLast({
      fields,
      lists,
    });

    return generatedMapping;
  },
  isNSMappingAssistantSupported: () => {
    const browser = Browser.getParser(window.navigator.userAgent);
    const { name, version } = browser.getBrowser();
    const browserVersion = parseInt(version, 10);

    // Chrome browser with versions >= 91 are not supported for NS Assistant to launch Iframe
    // Ref https://celigo.atlassian.net/browse/IO-21921
    if ((name === 'Chrome' && browserVersion >= 91) ||
        (name === 'Firefox' && browserVersion >= 98) ||
        (name === 'Safari' && browserVersion >= 15)) {
      return false;
    }

    return true;
  },
};
