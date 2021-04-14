import React from 'react';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import CsvParseRules from '../Editor/panels/CsvParseRules';
import FileDataPanelTitle from '../Editor/actions/FileDataPanelTitle';

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
      title: ({editorId}) => <FileDataPanelTitle editorId={editorId} fileType="csv" />,
      area: 'data',
      Panel: DataPanel,
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
