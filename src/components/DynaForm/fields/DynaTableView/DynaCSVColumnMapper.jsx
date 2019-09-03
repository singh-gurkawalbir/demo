import DynaTableView from './DynaTable';

export default function DynaCSVColumnMapper(props) {
  const {
    value,
    maxNumberOfColumns,
    extractFieldHeader,
    generateFieldHeader,
  } = props;
  let generates = [];

  if (value && !maxNumberOfColumns) {
    generates = value
      .filter(el => el.column)
      .map(el => ({ id: el.column.toString(), text: el.column.toString() }));
  }

  if (maxNumberOfColumns) {
    generates = [...Array(maxNumberOfColumns).keys()].map(a => ({
      id: `${a + 1}`,
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
      options: generates,
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

  return <DynaTableView {...props} optionsMap={optionsMap} />;
}
