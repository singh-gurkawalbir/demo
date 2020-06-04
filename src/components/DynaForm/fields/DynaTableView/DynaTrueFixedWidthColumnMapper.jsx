import React from 'react';
import produce from 'immer';
import { makeStyles } from '@material-ui/core/styles';
import DynaTableView from './DynaTable';

const useStyles = makeStyles(theme => ({
  camSettingFileParsingWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(2, 3),
  },
}));
const optionsMap = [
  {
    id: 'fieldName',
    label: 'Field Description',
    type: 'input',
    required: true,
    space: 4,
  },
  {
    id: 'startPosition',
    label: 'Start',
    required: false,
    type: 'number',
    space: 1,
  },
  {
    id: 'endPosition',
    label: 'End',
    required: false,
    type: 'number',
    space: 1,
  },
  {
    id: 'length',
    label: 'Length',
    required: false,
    type: 'number',
    readOnly: true,
    space: 1,
  },
  {
    id: 'regexExpression',
    label: 'Regex',
    required: false,
    type: 'input',
    space: 4,
  },
];

export default function DynaTrueFixedWidthColmnMapper({
  value,
  onFieldChange,
  id,
  label,
  title,
}) {
  let newValue;
  const classes = useStyles();

  if (value) {
    newValue = value.map(el => {
      let length = 0;

      if (el.startPosition && el.endPosition) {
        length = el.endPosition - el.startPosition + 1;
      }

      return { ...el, length };
    });
  }

  const onRowChange = (state, field, newValue) =>
    produce(state, draft => {
      if (
        optionsMap.find(f => f.id === field && f.type === 'number') &&
        // eslint-disable-next-line no-restricted-globals
        !isNaN(newValue)
      ) {
        draft[field] = parseInt(newValue, 10);
      } else draft[field] = newValue;

      if (['startPosition', 'endPosition'].includes(field)) {
        draft.length = draft.endPosition - draft.startPosition + 1;
      }
    });
  const fieldChangeHandler = (id, val = []) => {
    if (val && Array.isArray(val)) {
      onFieldChange(
        id,
        val.map(
          ({ fieldName, startPosition, endPosition, regexExpression }) => ({
            fieldName,
            startPosition,
            endPosition,
            regexExpression,
          })
        )
      );
    }
  };

  return (
    <DynaTableView
      id={id}
      hideLabel
      label={label}
      className={classes.camSettingFileParsingWrapper}
      title={title}
      optionsMap={optionsMap}
      value={newValue}
      onRowChange={onRowChange}
      onFieldChange={fieldChangeHandler}
    />
  );
}
