import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import * as selectors from '../../../reducers';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';
import getFormattedSampleData from '../../../utils/sampleData';

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

export default function DynaRelativeUri(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    connectionId,
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
    useSampleDataAsArray,
    resourceType,
    flowId,
    label,
    options,
  } = props;
  const { resourceName } = options;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    const { template } = editorValues;

    if (shouldCommit) {
      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'flowInput', {
      isImport: resourceType === 'imports',
    })
  );
  const formattedSampleData = JSON.stringify(
    getFormattedSampleData({
      connection,
      sampleData,
      useSampleDataAsArray,
      resourceType,
      resourceName,
    }),
    null,
    2
  );
  const handleFieldChange = event => {
    const { value } = event.target;

    onFieldChange(id, value);
  };

  let description = '';
  const { type } = connection || {};

  if (type === 'http' || type === 'rest') {
    description = `Relative to: ${connection[type].baseURI}`;
  }

  // console.log(
  //   'id, resourceName, formattedSampleData',
  //   id,
  //   resourceName,
  //   formattedSampleData
  // );

  return (
    <Fragment>
      {showEditor && (
        <UrlEditorDialog
          title="Relative URI Editor"
          id={id}
          data={formattedSampleData}
          rule={value}
          onClose={handleClose}
          disabled={disabled}
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
        helperText={isValid ? description : errorMessages}
        disabled={disabled}
        required={required}
        error={!isValid}
        value={value}
        variant="filled"
        onChange={handleFieldChange}
      />
    </Fragment>
  );
}
