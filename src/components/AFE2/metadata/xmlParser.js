import React from 'react';
import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import XmlParseRules from '../Editor/panels/XmlParseRules';
import FileUpload from '../Editor/actions/FileUpload';

export default {
  type: 'xmlParser',
  fieldId: 'file.xml',
  label: 'XML parser helper',
  description: 'Converts XML data into JSON',
  panels: [
    {
      title: 'XML parse options',
      area: 'rule',
      Panel: XmlParseRules,
    },
    {
      title: ({editorId}) => <FileUpload editorId={editorId} fileType="xml" />,
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'xml',
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
