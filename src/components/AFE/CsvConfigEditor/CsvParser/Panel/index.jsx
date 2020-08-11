import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Input, Chip, MenuItem, ListItemText, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CeligoSelect from '../../../../CeligoSelect';
import DynaText from '../../../../DynaForm/fields/DynaText';
import options from '../../options';
import DynaSelectWithInput from '../../../../DynaForm/fields/DynaSelectWithInput';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const getColumns = result => {
  if (!result || !result.data || !result.data.length) {
    return [];
  }

  const sampleRecord = Array.isArray(result.data[0])
    ? result.data[0][0]
    : result.data[0];

  return Object.keys(sampleRecord);
};

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
    trimSpaces = false,
    result,
    rowsToSkip,
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
    const options = getColumns(result);

    if (Array.isArray(keyColumns)) {
      keyColumns.forEach(val => {
        if (!options.find(opt => opt === val)) {
          options.push(val);
        }
      });
    }

    return options;
  }, [keyColumns, result, showKeyColumnsOptions]);

  useEffect(() => {
    if (showKeyColumnsOptions === false && status !== 'requested') setShowKeyColumnsOptions(true);
  }, [showKeyColumnsOptions, status]);

  // TODO: Refractor to use dyna form
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
                patchEditor('hasHeaderRow', !hasHeaderRow, true);
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
            <InputLabel htmlFor="select-multiple-chip" shrink>
              Key columns
            </InputLabel>
            <Select
              multiple
              value={keyColumns}
              className={classes.select}
              data-test="keyColumns"
              onChange={e => patchEditor('keyColumns', e.target.value)}
              input={<Input id="select-multiple-chip" />}
              renderValue={keyColumns => (
                <div className={classes.chips}>
                  {keyColumns.map(col => (
                    <Chip key={col} label={col} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}>
              {allColumns.map(name => (
                <MenuItem
                  key={name}
                  value={name}
                  data-test={name}
                  className={classes.menuItems}>
                  <Checkbox
                    checked={keyColumns.indexOf(name) !== -1}
                    color="primary"
                  />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </FormGroup>
    </div>
  );
}
