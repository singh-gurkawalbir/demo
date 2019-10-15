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
    trimSpaces = true,
    result,
  } = useSelector(state => selectors.editor(state, editorId));
  const dispatch = useDispatch();
  const patchEditor = (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  };

  const allColumns = getColumns(result);

  return (
    <div className={classes.container}>
      <FormGroup column="true">
        <FormControl className={classes.formControl}>
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
            <option value="">Auto Detect</option>
            <option value=",">Comma (,)</option>
            <option value="|">Pipe (|)</option>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="rowDelimiter">
            Row Delimiter
          </InputLabel>
          <Select
            native
            value={rowDelimiter}
            onChange={event => patchEditor('rowDelimiter', event.target.value)}
            inputProps={{ id: 'rowDelimiter' }}>
            <option value="">Auto Detect</option>
            <option value="cr">CR (\r)</option>
            <option value="lf">LF (\n)</option>
            <option value="crlf">CRLF (\r\n)</option>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              // Why it is commented ?
              color="primary"
              checked={hasHeaderRow}
              onChange={() => patchEditor('hasHeaderRow', !hasHeaderRow)}
            />
          }
          label="Has Header Row"
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={trimSpaces}
              onChange={() => patchEditor('trimSpaces', !trimSpaces)}
            />
          }
          label="Trim Spaces"
        />
        {allColumns && (
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-chip">Key Columns</InputLabel>
            <Select
              multiple
              value={keyColumns}
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
                <MenuItem key={name} value={name}>
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
