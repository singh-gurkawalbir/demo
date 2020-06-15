export default {
  preSave: formValues => {
    const newValues = { ...formValues };
    delete newValues['/file/csvHelper'];
    const jsonResourcePath = newValues['/file/json/resourcePath'] || {};
    if (typeof jsonResourcePath === 'object' && 'resourcePathToSave' in jsonResourcePath) {
      newValues['/file/json/resourcePath'] = jsonResourcePath.resourcePathToSave || '';
    }
    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }
    newValues['/file/output'] = 'records';
    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
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
    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }
    delete newValues['/file/decompressFiles'];
    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.xlsx.keyColumns') {
      const keyColoumnField = fields.find(
        field => field.id === 'file.xlsx.keyColumns'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.xlsx.hasHeaderRow'
      );
      // resetting key coloums when hasHeaderRow changes
      if (keyColoumnField.hasHeaderRow !== hasHeaderRowField.value) {
        keyColoumnField.value = [];
        keyColoumnField.hasHeaderRow = hasHeaderRowField.value;
      }
      return {
        includeHeader: hasHeaderRowField.value,
      };
    }
    if (fieldId === 'uploadFile') {
      const fileType = fields.find(field => field.id === 'file.type');
      return fileType.value;
    }
    if (fieldId === 'file.csvHelper') {
      const keyColumnsField = fields.find(
        field => field.id === 'file.csv.keyColumns'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );
      return {
        fields: {
          columnDelimiter: columnDelimiterField && columnDelimiterField.value,
          rowDelimiter: rowDelimiterField && rowDelimiterField.value,
          trimSpaces: trimSpacesField && trimSpacesField.value,
          rowsToSkip: rowsToSkipField && rowsToSkipField.value,
          hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
          keyColumns: keyColumnsField && keyColumnsField.value,
        },
      };
    }
    if (fieldId === 'file.csv.keyColumns') {
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );
      const options = {
        columnDelimiter: columnDelimiterField && columnDelimiterField.value,
        rowDelimiter: rowDelimiterField && rowDelimiterField.value,
        trimSpaces: trimSpacesField && trimSpacesField.value,
        rowsToSkip: rowsToSkipField && rowsToSkipField.value,
        hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
      };
      return options;
    }
  },
  fieldMap: {
    name: { fieldId: 'name', required: true },
    'file.type': {
      id: 'file.type',
      name: '/file/type',
      type: 'select',
      label: 'File type',
      defaultValue: r => r && r.file && r.file.type,
      options: [
        {
          items: [
            { label: 'CSV (or any delimited text file)', value: 'csv' },
            { label: 'JSON', value: 'json' },
            { label: 'XLSX', value: 'xlsx' },
            { label: 'XML', value: 'xml' },
          ],
        },
      ],
    },
    uploadFile: {
      id: 'uploadFile',
      name: '/uploadFile',
      type: 'uploadfile',
      label: 'Upload the file to use',
      mode: r => r && r.file && r.file.type,
      required: r => !r.rawData,
      refreshOptionsOnChangesTo: 'file.type',
      helpKey: 'export.uploadFile',
    },
    'file.csvHelper': {
      fieldId: 'file.csvHelper',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    'file.csv.columnDelimiter': { fieldId: 'file.csv.columnDelimiter' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'file.csv.trimSpaces': { fieldId: 'file.csv.trimSpaces' },
    'file.csv.rowsToSkip': { fieldId: 'file.csv.rowsToSkip' },
    'file.csv.hasHeaderRow': { fieldId: 'file.csv.hasHeaderRow' },
    'file.csv.rowsPerRecord': { fieldId: 'file.csv.rowsPerRecord' },
    'file.csv.keyColumns': { fieldId: 'file.csv.keyColumns' },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': { fieldId: 'file.xlsx.rowsPerRecord' },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    'file.xml.resourcePath': { fieldId: 'file.xml.resourcePath' },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
    },
    'fixed.format': { fieldId: 'fixed.format' },
    'file.encoding': { fieldId: 'file.encoding' },
    pageSize: { fieldId: 'pageSize' },
    dataURITemplate: { fieldId: 'dataURITemplate' },
  },
  layout: {
    containers: [
      {
        fields: [
          'name',
          'file.type',
          'uploadFile',
        ],
      },
      {
        type: 'indent',
        containers: [
          {fields: [
            'file.csv.columnDelimiter',
            'file.csv.rowDelimiter',
            'file.csv.trimSpaces',
            'file.csv.rowsToSkip',
            'file.csv.hasHeaderRow',
            'file.csv.rowsPerRecord',
            'file.csv.keyColumns',
            'file.csvHelper',
          ]}
        ]
      },
      {
        fields: ['file.xml.resourcePath',
          'file.json.resourcePath',
          'file.xlsx.hasHeaderRow',
          'file.xlsx.rowsPerRecord',
          'file.xlsx.keyColumns']
      },
      {
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Advanced',
            fields: ['file.encoding', 'pageSize', 'dataURITemplate'],
          },
        ],
      },
    ],
  },
};
/*
_id: "5dfa9a412f350e4437941144"
createdAt: "2019-12-18T21:29:37.432Z"
lastModified: "2019-12-18T21:29:37.442Z"
apiIdentifier: "ece2037e0d"
asynchronous: true
rawData: "runKey uuid"
type: "simple"
parsers: []
sampleData: "category,check,result_status,flagged_resource,flagged_resource_status,status_desc,excluded,excluded_by,last_updated_at↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,api-paysafeescrow-com,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,paysafeescrow-com,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,www-paysafeescrow-com,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,ELB CloudWatch Alarm Recommendations,red,PRD-ELB1,red,ELB's without any alarms created,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,CloudWatch Alarm SNS topic subscription usage,red,NotifyMe,red,Topic without any subscribers,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,CloudWatch Alarm SNS topic subscription usage,red,cw-alerts-PaySAFEEscrow,red,Topic without any subscribers,false,"",2016-10-04 02:14:08 -0400↵CloudWatch,RDS CloudWatch Alarm Recommendations,yellow,psedb,yellow,RDS Instances with some alarms missing,false,"",2016-10-04 02:14:08 -0400↵EC2,EIP's Not Associated,yellow,50.19.95.3,yellow,EIP's are not associated,false,"",2016-10-04 02:14:09 -0400↵EC2,EC2 Instance Classic use,yellow,Win 2008 IIS (i-dfbc15b1),yellow,An EC2 instance is running in EC2-Classic,false,"",2016-10-04 02:14:09 -0400↵EC2,EC2 Instance IAM Profile Use,yellow,Win 2008 IIS (i-dfbc15b1),yellow,IAM Profile is not associated with an EC2 instance,false,"",2016-10-04 02:14:10 -0400"
file: {encoding: "utf8", output: "records", skipDelete: false, type: "csv",…}
csv: {columnDelimiter: ",", hasHeaderRow: false, trimSpaces: true, rowsToSkip: 0}
*/
