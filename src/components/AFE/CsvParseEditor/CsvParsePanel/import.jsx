import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Input, Chip, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import CeligoSelect from '../../../CeligoSelect';
import options from './options';

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
}));

export default function ImportCsvParsePanel(props) {
  const { editorId, disabled } = props;
  const classes = useStyles(props);
  const {
    columnDelimiter = '',
    rowDelimiter = '',
    keyColumns = [],
    includeHeader = false,
    multipleRowsPerRecord = false,
    result,
    wrapWithQuotes = false,
    replaceTabWithSpace = false,
    replaceNewlineWithSpace = false,
    truncateLastRowDelimiter = false,
  } = useSelector(state => selectors.editor(state, editorId));
  const dispatch = useDispatch();
  const patchEditor = (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  };

  const allColumns = getColumns(result);

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
            placeholder="Please Select"
            onChange={event =>
              patchEditor('columnDelimiter', event.target.value)
            }
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
            placeholder="Please Select"
            inputProps={{ id: 'rowDelimiter' }}>
            <option value="cr" data-test="cr">
              CR (\r)
            </option>
            <option value="lf" data-test="lf">
              LF (\n)
            </option>
            <option value="crlf" data-test="crlf">
              CRLF (\r\n)
            </option>
          </CeligoSelect>
        </FormControl>
        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={includeHeader}
              data-test="includeHeader"
              onChange={() => patchEditor('includeHeader', !includeHeader)}
            />
          }
          label="Include Header"
        />

        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={multipleRowsPerRecord}
              data-test="multipleRowsPerRecord"
              onChange={() => {
                patchEditor('multipleRowsPerRecord', !multipleRowsPerRecord);
                patchEditor('keyColumns', []);
              }}
            />
          }
          label="Multiple Rows Per Record"
        />
        {multipleRowsPerRecord && allColumns && (
          <FormControl disabled={disabled} className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-chip" shrink>
              Key Columns
            </InputLabel>
            <CeligoSelect
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
                <MenuItem key={name} value={name} data-test={name}>
                  {name}
                </MenuItem>
              ))}
            </CeligoSelect>
          </FormControl>
        )}
        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={truncateLastRowDelimiter}
              data-test="truncateLastRowDelimiter"
              onChange={() => {
                patchEditor(
                  'truncateLastRowDelimiter',
                  !truncateLastRowDelimiter
                );
              }}
            />
          }
          label="Truncare last row delimiter"
        />
        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={wrapWithQuotes}
              data-test="wrapWithQuotes"
              onChange={() => {
                patchEditor('wrapWithQuotes', !wrapWithQuotes);
              }}
            />
          }
          label="Wrap with quotes"
        />
        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={replaceTabWithSpace}
              data-test="replaceTabWithSpace"
              onChange={() => {
                patchEditor('replaceTabWithSpace', !replaceTabWithSpace);
              }}
            />
          }
          label="Replace tab with space"
        />
        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={replaceNewlineWithSpace}
              data-test="replaceNewlineWithSpace"
              onChange={() => {
                patchEditor(
                  'replaceNewlineWithSpace',
                  !replaceNewlineWithSpace
                );
              }}
            />
          }
          label="Replace new line with space"
        />
      </FormGroup>
    </div>
  );
}
