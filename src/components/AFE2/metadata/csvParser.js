import React from 'react';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import CsvParseRules from '../Editor/panels/CsvParseRules';
import FileUpload from '../Editor/actions/FileUpload';

export default {
  type: 'csvParser',
  fieldId: 'file.csv',
  label: 'CSV parser helper',
  description: 'Converts delimited data into JSON',
  panels: [
    {
      title: 'CSV parser options',
      area: 'rule',
      Panel: CsvParseRules,
    },
    {
      title: ({editorId, fieldId = 'a', formKey = 'a'}) => fieldId && formKey
        ? <FileUpload editorId={editorId} />
        : 'Sample CSV file',
      area: 'data',
      Panel: DataPanel,
      props: {
        // mode: 'text',
      },
    },
    {
      title: 'Parsed output',
      area: 'result',
      Panel: ResultPanel,
      props: {
        mode: 'json',
      },
    },
  ],
};
