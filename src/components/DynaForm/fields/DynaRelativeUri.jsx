import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import * as selectors from '../../../reducers';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';
import getFormattedSampleData from '../../../utils/sampleData';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';

const useStyles = makeStyles({
  textField: {
    minWidth: 200,
  },
});

// TODO(Aditya): remove this component and use DynaRelativeURIWithLookup after refractor
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

  const dispatch = useDispatch();
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

  useEffect(() => {
    // Request for sample data only incase of flow context
    // TODO : @Raghu Do we show default data in stand alone context?
    // What type of sample data is expected in case of Page generators
    if (flowId && !sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  const handleFieldChange = event => {
    const { value } = event.target;

    onFieldChange(id, value);
  };

  let description = '';
  const { type } = connection || {};

  if (type === 'http' || type === 'rest') {
    description = `Relative to: ${connection[type].baseURI}`;
  }

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
      <ActionButton data-test={id} onClick={handleEditorClick}>
        <OpenInNewIcon />
      </ActionButton>
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
