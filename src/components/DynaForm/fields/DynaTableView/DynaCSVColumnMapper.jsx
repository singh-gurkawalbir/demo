import React, { useMemo } from 'react';
import DynaTableView from './DynaTable';
import { customCloneDeep } from '../../../../utils/customCloneDeep';

export default function DynaCSVColumnMapper(props) {
  const {
    maxNumberOfColumns,
    extractFieldHeader,
    generateFieldHeader,
    value,
  } = props;

  const newValue = value.map(val => {
    const v = customCloneDeep(val);

    // We support both string/number type numbers in Ampersand so adding this translation for backward compatibility.
    v.column = v.column && !Number.isNaN(v.column) ? parseInt(v.column, 10) : v.column;

    return v;
  });

  const optionsMap = useMemo(() => {
    let columnOptions = [];

    if (newValue && !maxNumberOfColumns) {
      columnOptions = newValue
        .filter(el => el.column)
        .map(el => ({ id: el.column, text: el.column.toString() }));
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
  }, [extractFieldHeader, generateFieldHeader, maxNumberOfColumns, newValue]);

  return (
    <DynaTableView
      {...props}
      value={newValue}
      collapsable
      hideLabel
      optionsMap={optionsMap} />
  );
}
