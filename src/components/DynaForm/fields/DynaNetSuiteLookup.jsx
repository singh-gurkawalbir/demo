import React, { useEffect, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import * as selectors from '../../../reducers';
import NetSuiteLookupFilterEditorDrawer from '../../AFE/NetSuiteLookupFilterEditor/Drawer';
import actions from '../../../actions';
import getJSONPaths, { pickFirstObject } from '../../../utils/jsonPaths';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldHelp from '../FieldHelp';
import ErroredMessageComponent from './ErroredMessageComponent';

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
  const classes = useStyles();
  const {
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
  const history = useHistory();
  const match = useRouteMatch();
  const handleEditorClick = useCallback(() => {
    history.push(`${match.url}/${id}`);
  }, [history, id, match.url]);

  const dispatch = useDispatch();
  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, JSON.stringify(rule));
    }
  }, [id, onFieldChange]);

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
    const extractPaths = getJSONPaths(pickFirstObject(extractFields));

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
    <>
      <NetSuiteLookupFilterEditorDrawer
        title="Define lookup criteria"
        id={id}
        data={formattedExtractFields}
        value={rule}
        onSave={handleSave}
        options={options}
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
            disabled={options?.disableFetch}
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
