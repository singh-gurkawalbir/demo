import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { Input, Chip, MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

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
    height: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
  },
}));

export default function CsvParsePanel(props) {
  const { editorId } = props;
  const classes = useStyles(props);
  const {
    columnDelimiter = '',
    rowDelimiter = '',
    keyColumns = [],
    hasHeaderRow = true,
    multipleRowsPerRecord = false,
    trimSpaces = true,
    result,
    disabled,
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
          <Select
            native
            value={columnDelimiter}
            onChange={event =>
              patchEditor('columnDelimiter', event.target.value)
            }
            inputProps={{ id: 'columnDelimiter' }}>
            <option value="" data-test="autoDetect">
              Auto Detect
            </option>
            <option value="," data-test="comma">
              Comma (,)
            </option>
            <option value="|" data-test="pipe">
              Pipe (|)
            </option>
          </Select>
        </FormControl>
        <FormControl disabled={disabled} className={classes.formControl}>
          <InputLabel shrink htmlFor="rowDelimiter">
            Row Delimiter
          </InputLabel>
          <Select
            native
            value={rowDelimiter}
            onChange={event => patchEditor('rowDelimiter', event.target.value)}
            inputProps={{ id: 'rowDelimiter' }}>
            <option value="" data-test="autoDetect">
              Auto Detect
            </option>
            <option value="cr" data-test="cr">
              CR (\r)
            </option>
            <option value="lf" data-test="lf">
              LF (\n)
            </option>
            <option value="crlf" data-test="crlf">
              CRLF (\r\n)
            </option>
          </Select>
        </FormControl>

        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              // Why it is commented ?
              color="primary"
              checked={hasHeaderRow}
              data-test="hasHeaderRow"
              onChange={() => patchEditor('hasHeaderRow', !hasHeaderRow)}
            />
          }
          label="Has Header Row"
        />
        <FormControlLabel
          disabled={disabled}
          control={
            <Checkbox
              color="primary"
              checked={trimSpaces}
              data-test="trimSpaces"
              onChange={() => patchEditor('trimSpaces', !trimSpaces)}
            />
          }
          label="Trim Spaces"
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
            <InputLabel htmlFor="select-multiple-chip">Key Columns</InputLabel>
            <Select
              multiple
              value={keyColumns}
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
            </Select>
          </FormControl>
        )}
      </FormGroup>
    </div>
  );
}
