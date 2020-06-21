function isFileOrNetSuiteBatchExport(res) {
  if (res.netsuite && (res.netsuite.type === 'search' || (res.netsuite.restlet && res.netsuite.restlet.searchId))) {
    return true;
  }
  if (((res.ftp && res.ftp.directoryPath) || res.type === 'simple' || (res.s3 && res.s3.bucket)) && res.file && res.file.type === 'csv') {
    return true;
  }
  return false;
}


const generateFieldAndListMappings = ({importType, mapping, exportRes, isGroupedSampleData}) => {
  const isNetsuiteImport = importType === 'netsuite';
  const {fields = [], lists = []} = mapping || {};
  const toReturn = [];
  fields.forEach(fm => {
    if (!fm.mappingId) { // not a reference record mapping
      const tempFm = {...fm};
      if (fm.internalId) {
        if (isNetsuiteImport) {
          tempFm.generate += '.internalid';
        } else {
          tempFm.extract += '.internalid';
        }
      }
      if (isFileOrNetSuiteBatchExport(exportRes)) { // it is an ftp/s3/simple export
        if (/^\[.*\]$/.test(tempFm.extract)) { // if extract starts with [ and ends with ]
          tempFm.extract = tempFm.extract.replace(/^(\[)(.*)(\])$/, '$2');
        }
      }
      toReturn.push(tempFm);
    }
  });

  lists.forEach(lm => {
    lm.fields.forEach(fm => {
      if (!fm.mappingId) { // not a reference record mapping
        const tempFm = { ...fm };

        tempFm.generate = [lm.generate, tempFm.generate].join('[*].');

        if (fm.internalId) {
          if (isNetsuiteImport) {
            tempFm.generate += '.internalid';
          } else {
            tempFm.extract += '.internalid';
          }
        }

        if (isFileOrNetSuiteBatchExport(exportRes) && /^\['.*']$/.test(tempFm.extract)) {
          // if extract starts with [' and ends with ']
          tempFm.extract = tempFm.extract.replace(/^(\[')(.*)('])$/, '$2'); // removing [' and '] at begining and end of extract that we added
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
        toReturn.push(tempFm);
      }
    });
  });
  return toReturn;
};

const validateMappings = (mappings, lookups) => {
  const duplicateMappings = mappings
    .filter(e => !!e.generate)
    .map(e => e.generate)
    .map((e, i, final) => final.indexOf(e) !== i && i)
    .filter(obj => mappings[obj])
    .map(e => mappings[e].generate);

  if (duplicateMappings.length) {
    return {
      isSuccess: false,
      errMessage: `You have duplicate mappings for the field(s): ${duplicateMappings.join(
        ','
      )}`,
    };
  }

  const mappingsWithoutGenerates = mappings.filter(mapping => {
    if (!mapping.generate) return true;

    return false;
  });

  if (mappingsWithoutGenerates.length) {
    return {
      isSuccess: false,
      errMessage: 'One or more generate fields missing',
    };
  }
  const mappingsWithoutExtract = mappings.filter(mapping => {
    if (!('hardCodedValue' in mapping || mapping.extract)) return true;

    return false;
  });
  const generatesWithoutExtract = [];

  mappingsWithoutExtract.forEach(mapping => {
    if (mapping.lookupName) {
      const lookup = lookups.find(l => l.name === mapping.lookupName);

      // check if mapping has dynamic lookup
      if (!lookup || lookup.map) {
        generatesWithoutExtract.push(mapping);
      }
    } else {
      generatesWithoutExtract.push(mapping);
    }
  });
  const missingExtractGenerateNames = generatesWithoutExtract.map(
    mapping => mapping.generate
  );

  if (missingExtractGenerateNames.length) {
    return {
      isSuccess: false,
      errMessage: `Extract Fields missing for field(s): ${missingExtractGenerateNames.join(
        ','
      )}`,
    };
  }

  return { isSuccess: true };
};

const updateMappingConfigs = ({importType, mappings = [], recordType, exportConfig}) => {
  const isNetsuiteImport = importType === 'netsuite';
  let generateParts;
  const lists = [];
  const fields = [];
  let generateListPath;


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
        // if (self.parent.type === 'salesforce') {
        //     var childRelationship = self.parent.salesforce.sObject.childRelationships.get(list.generate)
        //     list.salesforce.relationshipField = childRelationship.field
        //     list.salesforce.sObjectType = childRelationship.childSObject
        //   }
      }
    }
    if (isNetsuiteImport) {
      let isItemSubtypeRecord = false;
      isItemSubtypeRecord = (['noninventoryitem', 'otherchargeitem', 'serviceitem'].indexOf(recordType) > -1);
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
      if (exportConfig.type === 'sa.lesforce' && exportConfig.salesforce && exportConfig.salesforce.soql && exportConfig.salesforce.soql.query && mapping.extract && mapping.extract.indexOf('[*].') > -1) {
        mapping.extract = mapping.extract.replace('[*].', '.');
      }
    } else if (mapping.extract) {
      if (mapping.extract.indexOf('.internalid') > 0) {
        mapping.internalId = true;
        mapping.extract = mapping.extract.replace('.internalid', '');
      } else {
        mapping.internalId = false;
      }
    }
    // key is property added in UI side. removing it while saving.
    delete mapping.key;
    delete mapping.rowIdentifier;
    list ? list.fields.push(mapping) : fields.push(mapping);
  });

  return {
    fields,
    lists,
  };
};

export default {
  validateMappings,
  generateFieldAndListMappings,
  updateMappingConfigs
};
