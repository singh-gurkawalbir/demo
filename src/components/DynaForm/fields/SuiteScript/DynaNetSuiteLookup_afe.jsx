/* eslint-disable camelcase */
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { TextField, FormControl, FormLabel } from '@mui/material';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import ActionButton from '../../../ActionButton';
import FilterIcon from '../../../icons/FilterIcon';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import { getValidRelativePath } from '../../../../utils/routePaths';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

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

export default function DynaNetSuiteLookup_afe(props) {
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
    label,
    ssLinkedConnectionId,
    integrationId,
    resourceContext,
    flowId,
    formKey,
    resourceId,
    isLoggable,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    onFieldChange(id, rule.length > 0 ? JSON.stringify(rule) : '');
  }, [id, onFieldChange]);

  const extractFields = useSelector(state => selectors.suiteScriptExtracts(state, {ssLinkedConnectionId, integrationId, flowId: resourceContext.resourceId})).data;

  useEffect(() => {
    dispatch(
      actions.suiteScript.sampleData.request(
        {
          ssLinkedConnectionId,
          integrationId,
          flowId: resourceContext.resourceId,
        }
      )
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'netsuiteLookupFilter', {
      formKey,
      flowId,
      resourceId,
      resourceType: resourceContext.resourceType,
      fieldId: id,
      stage: 'importMappingExtract',
      onSave: handleSave,
      data: extractFields,
      ssLinkedConnectionId,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, extractFields, formKey, flowId, handleSave, history, id, match.url, resourceContext.resourceType, resourceId, ssLinkedConnectionId]);

  return (
    <>
      <FormControl variant="standard" className={classes.dynaNetsuiteLookupFormControl}>
        <div className={classes.dynaNetsuiteLookupLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <div className={classes.dynaNetsuiteFieldLookupWrapper}>
          <div className={classes.dynaNetsuiteLookupField}>
            <TextField
              {...isLoggableAttr(isLoggable)}
              key={id}
              name={name}
              className={classes.dynaNetsuiteLookupField}
              placeholder={placeholder}
              disabled
              value={value}
              variant="filled"
          />
            <FieldMessage
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
