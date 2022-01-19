import React, { useMemo } from 'react';
import { cloneDeep } from 'lodash';
import DynaTableView from './DynaTable';

export default function DynaCSVColumnMapper(props) {
  const {
    maxNumberOfColumns,
    extractFieldHeader,
    generateFieldHeader,
    value,
  } = props;

  const optionsMap = useMemo(() => {
    let columnOptions = [];
    const newValue = value.map(val => {
      const v = cloneDeep(val);

      // We support both string/number type numbers in Ampersand so adding this translation for backward compatibility.
      v.column = v.column && !Number.isNaN(v.column) ? parseInt(v.column, 10) : v.column;

      return v;
    });

    if (newValue && !maxNumberOfColumns) {
      columnOptions = newValue
        .filter(el => el.column)
        .map(el => ({ id: el.column.toString(), text: el.column.toString() }));
    }

    if (maxNumberOfColumns) {
      columnOptions = [...Array(maxNumberOfColumns).keys()].map(a => ({
        id: a + 1,
        text: `${a + 1}`,
      }));
    }

    return [
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
  }, [extractFieldHeader, generateFieldHeader, maxNumberOfColumns, value]);
  // console.log('render: <DynaCSVColumnMapper>');

  return (
    <DynaTableView {...props} collapsable hideLabel optionsMap={optionsMap} />
  );
}
