import React from 'react';
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
import options from '../CsvParseRules/options';
import DynaSelectWithInput from '../../../../DynaForm/fields/DynaSelectWithInput';
import DynaText from '../../../../DynaForm/fields/DynaText';

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

export default function CsvGeneratePanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const rule = useSelector(state => selectors._editorRule(state, editorId));
  const {resourceId, resourceType} = useSelector(state => {
    const {resourceId, resourceType} = selectors._editor(state, editorId);

    return {resourceId, resourceType};
  }, shallowEqual);

  const {
    columnDelimiter = '',
    rowDelimiter = '',
    includeHeader = false,
    wrapWithQuotes = false,
    replaceTabWithSpace = false,
    replaceNewlineWithSpace = false,
    truncateLastRowDelimiter = false,
    customHeaderRows,
  } = rule || {};

  const customHeaderRowsSupported = useSelector(state => {
    if (!resourceId || !resourceType) {
      return false;
    }
    const {merged: resource = {}} = selectors.resourceData(state, resourceType, resourceId);

    return resource?.adaptorType === 'HTTPImport';
  });
  const patchEditor = (field, value) => {
    const newRule = {...rule, [field]: value};

    dispatch(actions._editor.patchRule(editorId, newRule));
  };

  /** customHeaderRow is not enabled for all Apps.
  Though BE has support for all apps but request was to only enable it for HTTP.
  If it is to be enabled for other apps as well. The same is to be added to defaultValue of metadata declaration
*/

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
          control={(
            <Checkbox
              color="primary"
              checked={includeHeader}
              data-test="includeHeader"
              onChange={() => patchEditor('includeHeader', !includeHeader)}
            />
          )}
          label="Include header"
        />
        <FormControlLabel
          disabled={disabled}
          control={(
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
          )}
          label="Truncate last row delimiter"
        />
        <FormControlLabel
          disabled={disabled}
          control={(
            <Checkbox
              color="primary"
              checked={wrapWithQuotes}
              data-test="wrapWithQuotes"
              onChange={() => {
                patchEditor('wrapWithQuotes', !wrapWithQuotes);
              }}
            />
          )}
          label="Wrap with quotes"
        />
        <FormControlLabel
          disabled={disabled}
          control={(
            <Checkbox
              color="primary"
              checked={replaceTabWithSpace}
              data-test="replaceTabWithSpace"
              onChange={() => {
                patchEditor('replaceTabWithSpace', !replaceTabWithSpace);
              }}
            />
          )}
          label="Replace tab with space"
        />
        <FormControlLabel
          disabled={disabled}
          control={(
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
          )}
          label="Replace new line with space"
        />
        {customHeaderRowsSupported && (
          <FormControl disabled={disabled} className={classes.formControl}>
            <DynaText
              color="primary"
              value={customHeaderRows}
              label="Custom header rows"
              data-test="customHeaderRows"
              disabled={disabled}
              onFieldChange={(id, value) => patchEditor('customHeaderRows', value)}
              multiline
              rowsMax={4}
            />
          </FormControl>
        )}
      </FormGroup>
    </div>
  );
}
