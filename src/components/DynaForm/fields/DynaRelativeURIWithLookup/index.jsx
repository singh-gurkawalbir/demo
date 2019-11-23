import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../reducers';
import UrlEditorDialog from '../../../../components/AFE/UrlEditor/Dialog';
import InputWithLookupHandlebars from './InputWithLookupHandlebars';
import getFormattedSampleData from '../../../../utils/sampleData';
import actions from '../../../../actions';
import ActionButton from '../../../ActionButton';
import ExitIcon from '../../../icons/ExitIcon';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaRelativeURIWithLookup(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    connectionId,
    disabled,
    errorMessages,
    id,
    isValid,
    multiline,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    label,
    options = {},
    resourceId,
    useSampleDataAsArray,
    resourceType,
    flowId,
    arrayIndex,
  } = props;
  const { resourceName, lookups } = options;
  const { fieldId: lookupFieldId, data: lookupData } = lookups || {};
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const dispatch = useDispatch();
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

  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleLookupUpdate = lookups => {
    onFieldChange(lookupFieldId, lookups);
  };

  const handleFieldChange = (_id, val) => {
    if (typeof arrayIndex === 'number' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = value;

      valueTmp[arrayIndex] = val;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, val);
    }
  };

  const handleClose = (shouldCommit, editorValues) => {
    const { template } = editorValues;

    if (shouldCommit) {
      handleFieldChange(id, template);
    }

    handleEditorClick();
  };

  let description = '';
  const { type } = connection || {};

  if (type === 'http' || type === 'rest') {
    description = `Relative to: ${connection[type].baseURI}`;
  }

  const extactedVal =
    options && typeof arrayIndex === 'number' && Array.isArray(value)
      ? value[arrayIndex]
      : value;

  return (
    <Fragment>
      {showEditor && (
        <UrlEditorDialog
          title="Relative URI Editor"
          id={id}
          data={formattedSampleData}
          rule={extactedVal}
          lookups={lookupData}
          onClose={handleClose}
        />
      )}
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButton}>
        <ExitIcon />
      </ActionButton>
      <InputWithLookupHandlebars
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        isValid={isValid}
        description={description}
        errorMessages={errorMessages}
        disabled={disabled}
        multiline={multiline}
        onFieldChange={handleFieldChange}
        lookups={lookupData}
        onLookupUpdate={handleLookupUpdate}
        required={required}
        value={extactedVal}
      />
    </Fragment>
  );
}
