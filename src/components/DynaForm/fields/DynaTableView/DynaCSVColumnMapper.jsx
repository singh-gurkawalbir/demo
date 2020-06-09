import React from 'react';
import DynaTableView from './DynaTable';

export default function DynaCSVColumnMapper(props) {
  const {
    maxNumberOfColumns,
    extractFieldHeader,
    generateFieldHeader,
  } = props;
  let {value } = props
  let columnOptions = [];

  value = value.map(v => {
    // eslint-disable-next-line no-param-reassign
    v.column = v.column &&
    // We support both string/number type numbers in Ampersand so adding this translation for backward compatibility.
    // eslint-disable-next-line no-restricted-globals
    !isNaN(parseInt(v.column, 10)) ? parseInt(v.column, 10) : v.column
    return v
  })
  if (value && !maxNumberOfColumns) {
    columnOptions = value
      .filter(el => el.column)
      .map(el => ({ id: el.column.toString(), text: el.column.toString() }));
  }

  if (maxNumberOfColumns) {
    columnOptions = [...Array(maxNumberOfColumns).keys()].map(a => ({
      id: a + 1,
      text: `${a + 1}`,
    }));
  }

  const optionsMap = [
    {
      id: 'fieldName',
      label: extractFieldHeader || 'Field Description',
      type: 'input',
      required: true,
      supportsRefresh: false,
    },
    {
      id: 'column',
      label: generateFieldHeader || 'Column Index',
      options: columnOptions,
      required: false,
      type: 'select',
      supportsRefresh: false,
    },
    {
      id: 'columnName',
      label: 'Column Name',
      required: false,
      type: 'input',
      supportsRefresh: false,
    },
    {
      id: 'regexExpression',
      label: 'Regex',
      required: false,
      type: 'input',
      supportsRefresh: false,
    },
  ];

  // console.log('render: <DynaCSVColumnMapper>');

  return (
    <DynaTableView {...props} collapsable hideLabel optionsMap={optionsMap} />
  );
}
