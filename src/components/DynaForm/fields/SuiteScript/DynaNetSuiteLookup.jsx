import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import NetSuiteLookupFilterEditorDialog from '../../../AFE/NetSuiteLookupFilterEditor';
import actions from '../../../../actions';
import ActionButton from '../../../ActionButton';
import FilterIcon from '../../../icons/FilterIcon';
import FieldHelp from '../../FieldHelp';
import ErroredMessageComponent from '../ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  dynaNetsuiteLookupFormControl: {
    width: '100%',
  },
  dynaNetsuiteLookupLabelWrapper: {
    width: '100%',
  },
  dynaNetsuiteFieldLookupWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaNetsuiteLookupField: {
    width: '100%',
  },
  dynaNetsuiteLookupActionBtn: {
    marginTop: theme.spacing(1),
  },
}));

export default function DynaNetSuiteLookup(props) {
  const { ssLinkedConnectionId, integrationId, resourceContext } = props;
  const [showEditor, setShowEditor] = useState(false);
  const [flowSampleDataLoaded, setFlowSampleDataLoaded] = useState(false);
  const classes = useStyles();
  const {
    // disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    label,
    options,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, JSON.stringify(rule));
    }

    handleEditorClick();
  };

  const {status: flowSampleDataStatus, data: flowSampleData} = useSelector(state =>
    selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId: resourceContext.resourceId})
  );


  let formattedExtractFields = [];

  if (flowSampleData) {
    formattedExtractFields =
      (flowSampleData?.map(obj => ({ name: obj.name || obj.label, id: obj.id || obj.value }))) ||
      [];
  }

  useEffect(() => {
    if (
      !flowSampleDataLoaded &&
      (flowSampleDataStatus === 'received' || flowSampleDataStatus === 'error')
    ) {
      setFlowSampleDataLoaded(true);
    }
  }, [flowSampleDataLoaded, flowSampleDataStatus]);

  const requestFlowSampleData = useCallback(
    () => {
      dispatch(
        actions.suiteScript.sampleData.request(
          {
            ssLinkedConnectionId,
            integrationId,
            flowId: resourceContext.resourceId,
          }
        )
      );
    },
    [dispatch, integrationId, resourceContext.resourceId, ssLinkedConnectionId]
  );

  useEffect(() => {
    if (!flowSampleData && !flowSampleDataLoaded) {
      requestFlowSampleData();
    }
  }, [flowSampleData, flowSampleDataLoaded, requestFlowSampleData]);

  let rule = [];

  if (value) {
    try {
      rule = JSON.parse(value);
    } catch (e) {
      // do nothing
    }
  }

  return (
    <>
      {showEditor && (
        <NetSuiteLookupFilterEditorDialog
          title="Lookup criteria"
          id={id}
          data={formattedExtractFields}
          value={rule}
          onClose={handleClose}
          // disabled={disabled}
          options={options}
          autoEvaluate={false}
        />
      )}

      <FormControl className={classes.dynaNetsuiteLookupFormControl}>
        <div className={classes.dynaNetsuiteLookupLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>

        <div className={classes.dynaNetsuiteFieldLookupWrapper}>
          <div className={classes.dynaNetsuiteLookupField}>
            <TextField
              key={id}
              name={name}
              className={classes.dynaNetsuiteLookupField}
              placeholder={placeholder}
              disabled
              value={value}
              variant="filled"
            />
            <ErroredMessageComponent
              isValid={isValid}
              description=""
              errorMessages={errorMessages}
            />
          </div>
          <ActionButton
            data-test={id}
            onClick={handleEditorClick}
            className={classes.dynaNetsuiteLookupActionBtn}>
            <FilterIcon />
          </ActionButton>
        </div>
      </FormControl>
    </>
  );
}
