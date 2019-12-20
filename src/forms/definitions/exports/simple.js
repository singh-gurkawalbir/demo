export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    }

    if (newValues['/outputMode'] === 'blob') {
      newValues['/file/skipDelete'] = newValues['/ftp/leaveFile'];
      newValues['/file/output'] = 'blobKeys';
      newValues['/file/type'] = undefined;
    }

    delete newValues['/outputMode'];

    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    delete newValues['/file/decompressFiles'];

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'uploadFile') {
      return fileType.value;
    }
  },
  fieldMap: {
    'file.type': { fieldId: 'file.type' },
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: 'file.type',
    },
    'file.csv': { fieldId: 'file.csv' },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': { fieldId: 'file.xlsx.rowsPerRecord' },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    'file.xml.resourcePath': { fieldId: 'file.xml.resourcePath' },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
    },
    'fixed.format': { fieldId: 'fixed.format' },
  },
  layout: {
    fields: [
      'file.type',
      'uploadFile',
      'file.csv',
      'file.xml.resourcePath',
      'file.json.resourcePath',
      'file.xlsx.hasHeaderRow',
      'file.xlsx.rowsPerRecord',
      'file.xlsx.keyColumns',
    ],
  },
};

/*
_id: "5dfa9a412f350e4437941144"
createdAt: "2019-12-18T21:29:37.432Z"
lastModified: "2019-12-18T21:29:37.442Z"
apiIdentifier: "ece2037e0d"
asynchronous: true
type: "simple"
parsers: []
sampleData: "category,check,result_status,flagged_resource,flagged_resource_status,status_desc,excluded,excluded_by,last_updated_at↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,api-paysafeescrow-com,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,paysafeescrow-com,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,www-paysafeescrow-com,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,PRD-ELB1,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,CloudWatch Alarm SNS topic subscription usage,red,NotifyMe,red,Topic without any subscribers,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,CloudWatch Alarm SNS topic subscription usage,red,cw-alerts-PaySAFEEscrow,red,Topic without any subscribers,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,RDS CloudWatch Alarm Recommendations,yellow,psedb,yellow,RDS Instances with some alarms missing,false,"",2016-10-04 02:14:08 -0400↵EC2,EIP's Not Associated,yellow,50.19.95.3,yellow,EIP's are not associated,false,"",2016-10-04 02:14:09 -0400↵EC2,EC2 Instance Classic use,yellow,Win 2008 IIS (i-dfbc15b1),yellow,An EC2 instance is running in EC2-Classic,false,"",2016-10-04 02:14:09 -0400↵EC2,EC2 Instance IAM Profile Use,yellow,Win 2008 IIS (i-dfbc15b1),yellow,IAM Profile is not associated with an EC2 instance,false,"",2016-10-04 02:14:10 -0400"
file: {encoding: "utf8", output: "records", skipDelete: false, type: "csv",…}
csv: {columnDelimiter: ",", hasHeaderRow: false, trimSpaces: true, rowsToSkip: 0}
*/
