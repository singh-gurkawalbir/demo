import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import * as selectors from '../../../reducers';
import NetSuiteLookupFilterEditorDialog from '../../AFE/NetSuiteLookupFilterEditor';
import actions from '../../../actions';
import getJSONPaths from '../../../utils/jsonPaths';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    float: 'right',
    marginLeft: 5,
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: 50,
    width: 50,
    borderRadius: 2,
    '&:hover': {
      background: theme.palette.background.paper,
      '& > span': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function DynaNetSuiteLookup(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    flowId,
    label,
    options,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const handleClose = (shouldCommit, editorValues) => {
    const { rule } = editorValues;

    if (shouldCommit) {
      onFieldChange(id, JSON.stringify(rule));
    }

    handleEditorClick();
  };

  const extractFields = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType: 'imports',
      stage: 'importMappingExtract',
    })
  );
  let formattedExtractFields = [];

  if (extractFields) {
    const extractPaths = getJSONPaths(extractFields);

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  useEffect(() => {
    if (flowId && !extractFields) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'importMappingExtract'
        )
      );
    }
  }, [dispatch, extractFields, flowId, resourceId]);

  let rule = [];

  if (value) {
    try {
      rule = JSON.parse(value);
    } catch (e) {
      // do nothing
    }
  }

  return (
    <Fragment>
      {showEditor && (
        <NetSuiteLookupFilterEditorDialog
          title="Lookup Criteria"
          id={id}
          data={formattedExtractFields}
          value={rule}
          onClose={handleClose}
          disabled={disabled}
          options={options}
        />
      )}
      <IconButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButton}>
        <OpenInNewIcon />
      </IconButton>
      <TextField
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={isValid ? '' : errorMessages}
        disabled
        required={required}
        error={!isValid}
        value={value}
        variant="filled"
      />
    </Fragment>
  );
}
