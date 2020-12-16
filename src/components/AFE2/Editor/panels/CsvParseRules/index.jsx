import React, { useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CeligoSelect from '../../../../CeligoSelect';
import DynaText from '../../../../DynaForm/fields/DynaText';
import options from '../../../../AFE/CsvConfigEditor/options';
import DynaSelectWithInput from '../../../../DynaForm/fields/DynaSelectWithInput';
import DynaMultiSelect from '../../../../DynaForm/fields/DynaMultiSelect';
import { getFileColumns } from '../../../../../utils/file';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 10,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
  formControl: {
    margin: theme.spacing(1),
  },
  select: {
    minWidth: 180,
    padding: theme.spacing(1),
  },
  label: {
    zIndex: 1,
    padding: theme.spacing(0.6, 1),
  },
  menuItems: {
    paddingRight: 0,
    '&:before': {
      display: 'none',
    },
  },
  checkboxOffset: {
    marginLeft: 6,
  },
}));

export default function CsvParseRules({ editorId }) {
  const classes = useStyles();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const {result, sampleDataStatus} = useSelector(state => {
    const {result, sampleDataStatus} = selectors._editor(state, editorId);

    return {result, sampleDataStatus};
  }, shallowEqual);

  const {
    columnDelimiter = '',
    rowDelimiter = '',
    keyColumns = [],
    hasHeaderRow = false,
    multipleRowsPerRecord = false,
    trimSpaces = false,
    rowsToSkip,
  } = rule || {};

  const dispatch = useDispatch();
  const patchEditor = (field, value) => {
    const newRule = {...rule, [field]: value};

    if (field === 'multipleRowsPerRecord') {
      newRule.keyColumns = [];
    }
    dispatch(actions._editor.patchRule(editorId, newRule));
  };
  const showKeyColumnsOptions = sampleDataStatus !== 'requested';

  const allColumns = useMemo(() => {
    if (!showKeyColumnsOptions) {
      return [];
    }
    const options = getFileColumns(result);

    if (Array.isArray(keyColumns)) {
      keyColumns.forEach(val => {
        if (!options.find(opt => opt === val)) {
          options.push(val);
        }
      });
    }

    const formattedOptions = options.map(val => ({label: val, value: val}));

    return [{ items: formattedOptions }];
  }, [keyColumns, result, showKeyColumnsOptions]);

  // TODO: Refactor to use dyna form
  return (
    <div className={classes.container}>
      <FormGroup column="true">
        <FormControl disabled={disabled} className={classes.formControl}>
          <DynaSelectWithInput
            label="Column delimiter"
            value={columnDelimiter}
            disabled={disabled}
            isValid={columnDelimiter.length}
            onFieldChange={(_id, value) =>
              patchEditor('columnDelimiter', value)}
            options={options.ColumnDelimiterOptions}
          />
        </FormControl>
        <FormControl disabled={disabled} className={classes.formControl}>
          <InputLabel shrink htmlFor="rowDelimiter">
            Row delimiter
          </InputLabel>
          <CeligoSelect
            native
            value={rowDelimiter}
            className={classes.select}
            onChange={event => patchEditor('rowDelimiter', event.target.value)}
            placeholder="Please select"
            inputProps={{ id: 'rowDelimiter' }}>
            {options.RowDelimiterOptions.map(opt => (
              <option key={opt.value} value={opt.value} data-test={opt.value}>
                {opt.label}
              </option>
            ))}
          </CeligoSelect>
        </FormControl>

        <FormControlLabel
          disabled={disabled}
          className={classes.checkboxOffset}
          control={(
            <Checkbox
              color="primary"
              checked={trimSpaces}
              data-test="trimSpaces"
              onChange={() => patchEditor('trimSpaces', !trimSpaces)}
            />
          )}
          label="Trim spaces"
        />
        <FormControlLabel
          disabled={disabled}
          className={classes.checkboxOffset}
          control={(
            <Checkbox
              color="primary"
              checked={hasHeaderRow}
              data-test="hasHeaderRow"
              onChange={() => {
                patchEditor('keyColumns', []);
                // hasHeaderRow patch to be last patch made
                patchEditor('hasHeaderRow', !hasHeaderRow);
              }}
            />
          )}
          label="File has header"
        />
        <FormControl disabled={disabled} className={classes.formControl}>
          <DynaText
            color="primary"
            checked={rowsToSkip}
            inputType="number"
            value={rowsToSkip}
            label="Number of rows to skip"
            data-test="rowsToSkip"
            disabled={disabled}
            isValid={rowsToSkip >= 0}
            onFieldChange={(id, value) => patchEditor('rowsToSkip', value)}
          />
        </FormControl>

        <FormControlLabel
          disabled={disabled || !result}
          className={classes.checkboxOffset}
          control={(
            <Checkbox
              color="primary"
              checked={multipleRowsPerRecord}
              data-test="multipleRowsPerRecord"
              onChange={() => patchEditor('multipleRowsPerRecord', !multipleRowsPerRecord)}
            />
          )}
          label="Multiple rows per record"
        />
        {multipleRowsPerRecord && allColumns && (
          <FormControl disabled={disabled} className={classes.formControl}>
            <DynaMultiSelect
              id="keyColumns"
              disabled={disabled}
              label="Key columns"
              value={keyColumns}
              options={allColumns}
              isValid
              onFieldChange={(_id, val) => patchEditor('keyColumns', val)} />
          </FormControl>
        )}
      </FormGroup>
    </div>
  );
}
