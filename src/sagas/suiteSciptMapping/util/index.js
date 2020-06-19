function isFileOrNetSuiteBatchExport(res) {
  if (res.netsuite && (res.netsuite.type === 'search' || (res.netsuite.restlet && res.netsuite.restlet.searchId))) {
    return true;
  }
  if (((res.ftp && res.ftp.directoryPath) || res.type === 'simple' || (res.s3 && res.s3.bucket)) && res.file && res.file.type === 'csv') {
    return true;
  }
  return false;
}


export const generateFieldAndListMappings = ({importType, mapping, exportRes, isGroupedSampleData}) => {
  const isNetsuiteImport = importType === 'netsuite';
  const {fields = [], lists = []} = mapping || {};
  const toReturn = [];
  fields.forEach(fm => {
    if (!fm.mappingId) { // not a reference record mapping
      const tempFm = {...fm}
      if (fm.internalId) {
        if (isNetsuiteImport) {
          tempFm.generate += '.internalid'
        } else {
          tempFm.extract += '.internalid'
        }
      }
      if (isFileOrNetSuiteBatchExport(exportRes)) { // it is an ftp/s3/simple export
        if (/^\[.*\]$/.test(tempFm.extract)) { // if extract starts with [ and ends with ]
          tempFm.extract = tempFm.extract.replace(/^(\[)(.*)(\])$/, '$2')
        }
      }
      toReturn.push(tempFm);
    }
  })

  lists.forEach(lm => {
    lm.fields.forEach(fm => {
      if (!fm.mappingId) { // not a reference record mapping
        const tempFm = { ...fm };

        tempFm.generate = [lm.generate, tempFm.generate].join('[*].');

        if (fm.internalId) {
          if (isNetsuiteImport) {
            tempFm.generate += '.internalid'
          } else {
            tempFm.extract += '.internalid'
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
  })
  return toReturn;
}

export default {
  generateFieldAndListMappings
}
