import { useDispatch, useSelector } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../../actions';
import * as selectors from '../../../../../reducers';
import CeligoSelect from '../../../../CeligoSelect';
import options from '../../options';

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
}));

export default function CsvGeneratePanel(props) {
  const { editorId, disabled } = props;
  const classes = useStyles(props);
  const {
    columnDelimiter = '',
    rowDelimiter = '',
    includeHeader = false,
    wrapWithQuotes = false,
    replaceTabWithSpace = false,
    replaceNewlineWithSpace = false,
    truncateLastRowDelimiter = false,
  } = useSelector(state => selectors.editor(state, editorId));
  const dispatch = useDispatch();
  const patchEditor = (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  };

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
              <option key={opt.value} value={opt.value} data-test={opt.value}>
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
            {options.RowDelimiterOptions.map(opt => (
              <option key={opt.value} value={opt.value} data-test={opt.value}>
                {opt.label}
              </option>
            ))}
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
          label="Truncate last row delimiter"
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
