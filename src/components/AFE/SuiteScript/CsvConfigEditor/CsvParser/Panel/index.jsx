import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import CeligoSelect from '../../../../../CeligoSelect';
import options from '../../options';
import DynaMultiSelect from '../../../../../DynaForm/fields/DynaMultiSelect';
import { getFileColumns } from '../../../../../../utils/file';

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

export default function CsvParsePanel(props) {
  const { editorId, disabled } = props;
  const classes = useStyles(props);
  const {
    columnDelimiter = '',
    rowDelimiter = '',
    keyColumns = [],
    hasHeaderRow = false,
    multipleRowsPerRecord = false,
    result,
    status,
  } = useSelector(state => selectors.editor(state, editorId));
  const [showKeyColumnsOptions, setShowKeyColumnsOptions] = useState(true);
  const dispatch = useDispatch();
  const patchEditor = (option, value, hasHeaderRowChanged) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
    setShowKeyColumnsOptions(!hasHeaderRowChanged);
  };

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

  useEffect(() => {
    if (showKeyColumnsOptions === false && status !== 'requested') {
      setShowKeyColumnsOptions(true);
    }
  }, [showKeyColumnsOptions, status]);

  // TODO: Refractor to use dyna form
  return (
    <div className={classes.container}>
      <FormGroup column="true">
        <FormControl disabled={disabled} className={classes.formControl}>
          <InputLabel shrink htmlFor="columnDelimiter">
            Column Delimiter
          </InputLabel>
          <CeligoSelect
            native
            value={columnDelimiter}
            className={classes.select}
            onChange={event =>
              patchEditor('columnDelimiter', event.target.value)}
            inputProps={{ id: 'columnDelimiter' }}>
            {options.ColumnDelimiterOptions.map(opt => (
              <option key={opt.type} value={opt.value} data-test={opt.type}>
                {opt.label}
              </option>
            ))}
          </CeligoSelect>
        </FormControl>
        <FormControl disabled={disabled} className={classes.formControl}>
          <InputLabel shrink htmlFor="rowDelimiter">
            Row Delimiter
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
              checked={hasHeaderRow}
              data-test="hasHeaderRow"
              onChange={() => {
                patchEditor('keyColumns', []);
                // hasHeaderRow patch to be last patch made
                patchEditor('hasHeaderRow', !hasHeaderRow, true);
              }}
            />
          )}
          label="File has header"
        />

        <FormControlLabel
          disabled={disabled || !result}
          className={classes.checkboxOffset}
          control={(
            <Checkbox
              color="primary"
              checked={multipleRowsPerRecord}
              data-test="multipleRowsPerRecord"
              onChange={() => {
                patchEditor('multipleRowsPerRecord', !multipleRowsPerRecord);
                patchEditor('keyColumns', []);
              }}
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
