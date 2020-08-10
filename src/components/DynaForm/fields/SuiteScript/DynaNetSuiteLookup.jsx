import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import NetSuiteLookupFilterEditorDrawer from '../../../AFE/NetSuiteLookupFilterEditor/Drawer';
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
  const history = useHistory();
  const match = useRouteMatch();
  const handleEditorClick = useCallback(() => {
    history.push(`${match.url}/${id}`);
  }, [history, id, match.url]);

  const dispatch = useDispatch();
  const handleSave = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, rule.length > 0 ? JSON.stringify(rule) : '');
    }
  };

  const {status: flowSampleDataStatus, data: flowSampleData} = useSelector(state =>
    selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId, flowId: resourceContext.resourceId})
  );
  const extractFields = useSelector(state => selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId: resourceContext.resourceId})).data;

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
      <NetSuiteLookupFilterEditorDrawer
        title="Define lookup criteria"
        id={id}
        data={extractFields}
        value={rule}
        onSave={handleSave}
        options={options}
        autoEvaluate={false}
        />

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
