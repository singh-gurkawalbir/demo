import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import lookupUtil from '../../../../utils/lookup';
import DynaLookupEditor from '../../../DynaForm/fields/DynaLookupEditor';
import { selectors } from '../../../../reducers';
import useFormContext from '../../../Form/FormContext';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import EditorDrawer from '../index';

export default function ManageLookup({ editorId }) {
  const {resourceType, formKey, resourceId, flowId, fieldId, resultMode, editorType} = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return {resourceType: e.resourceType,
      formKey: e.formKey,
      resourceId: e.resourceId,
      flowId: e.flowId,
      fieldId: e.fieldId,
      resultMode: e.resultMode,
      editorType: e.editorType};
  }, shallowEqual);
  const formContext = useFormContext(formKey);
  const { merged: resourceData = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );
  const { adaptorType } = resourceData;

  const lookups = useMemo(() => resourceType === 'imports' &&
    lookupUtil.getLookupFromFormContext(formContext, adaptorType),
  [adaptorType, formContext, resourceType]);

  const lookupFieldId = lookupUtil.getLookupFieldId(adaptorType);

  // lookups are only valid for http request body and sql query fields (not for uri fields)
  if (fieldId === '_body' || fieldId === '_query' || resourceType !== 'imports' || !lookupFieldId || (resultMode === 'text' && editorType !== 'sql')) {
    return null;
  }

  return (
    <>
      <DynaLookupEditor
        id={lookupFieldId}
        label="Manage lookups"
        value={lookups}
        formKey={formKey}
        flowId={flowId}
        resourceType={resourceType}
        resourceId={resourceId}
    />
      <EditorDrawer />
    </>
  );
}
