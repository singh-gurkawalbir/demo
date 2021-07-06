import React, { useMemo, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import lookupUtil from '../../../../utils/lookup';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import useFormContext from '../../../Form/FormContext';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import CeligoDivider from '../../../CeligoDivider';
import FieldHelp from '../../../DynaForm/FieldHelp';
import LookupDrawer from '../../../drawer/Lookup';
import * as completers from '../../Editor/panels/Handlebars/autocompleteSetup/completers';
import { emptyObject } from '../../../../utils/constants';

const useStyles = makeStyles({
  button: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },
});

export default function ManageLookup({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const handlebarHelperFunction = useSelector(state =>
    selectors.editorHelperFunctions(state), shallowEqual
  );

  const showLookup = useSelector(state => selectors.isEditorLookupSupported(state, editorId));
  const {resourceType, formKey, resourceId, flowId, lastValidData, editorLookups, fieldId} = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return {resourceType: e.resourceType,
      formKey: e.formKey,
      resourceId: e.resourceId,
      flowId: e.flowId,
      lastValidData: e.lastValidData,
      editorLookups: e.lookups,
      fieldId: e.fieldId,
    };
  }, shallowEqual);
  const formContext = useFormContext(formKey);
  const resourceData = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const { adaptorType } = resourceData;

  const lookups = useMemo(() => {
    if (resourceType === 'imports') {
      if (formKey) {
        return lookupUtil.getLookupFromFormContext(formContext, adaptorType);
      }

      return editorLookups;
    }
  },
  [resourceType, formKey, editorLookups, formContext, adaptorType]);

  const _lookups = useMemo(() => Array.isArray(lookups) ? lookups : [], [lookups]);

  useEffect(() => {
    completers.handleBarsCompleters.setJsonCompleter(lastValidData);
  }, [lastValidData]);

  const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);
  const handleEditorClick = () => {
    if (lookups?.length) {
      history.push(`${match.url}/lookup`);
    } else {
      history.push(`${match.url}/lookup/add`);
    }
  };
  const handleUpdate = lookups => {
    if (formKey) {
      dispatch(actions.form.fieldChange(formKey)(lookupFieldId, lookups));
    } else {
      // save lookups in state
      dispatch(actions.editor.patchFeatures(editorId, {lookups}));
    }
  };

  if (!showLookup || !lookupFieldId) {
    // don't show lookup helper suggestion if lookups aren't supported
    delete handlebarHelperFunction.lookup;
    completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
    // reset and delete lookups from completers
    completers.handleBarsCompleters.setLookupCompleter([]);

    return null;
  }
  completers.handleBarsCompleters.setLookupCompleter(_lookups, fieldId === 'http.relativeURI');
  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);

  return (
    <>
      <LookupDrawer
        id={lookupFieldId}
        lookups={lookups}
        resourceId={resourceId}
        resourceType={resourceType}
        flowId={flowId}
        onSave={handleUpdate} />
      <div className={classes.button}>
        <Button
          data-test={lookupFieldId}
          variant="outlined"
          color="secondary"
          onClick={handleEditorClick}>
          {lookups?.length ? 'Manage lookups' : 'Create lookup'}
        </Button>
        <FieldHelp
          id="Lookups"
          helpKey="afe.lookups"
          label="Lookups" />
      </div>
      <CeligoDivider position="right" />
    </>
  );
}
