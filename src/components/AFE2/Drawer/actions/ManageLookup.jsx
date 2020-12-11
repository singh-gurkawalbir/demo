import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import lookupUtil from '../../../../utils/lookup';
import DynaLookupEditor from '../../../DynaForm/fields/DynaLookupEditor';
import { selectors } from '../../../../reducers';
import useFormContext from '../../../Form/FormContext';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import EditorDrawer from '../index';

export default function ManageLookup({ editorId }) {
  const {resourceType, formKey, resourceId, flowId, fieldId} = useSelector(state => {
    const {resourceType, formKey, resourceId, flowId, fieldId} = selectors._editor(state, editorId);

    return {resourceType, formKey, resourceId, flowId, fieldId};
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

  if (fieldId === '_body' || resourceType !== 'imports' || !lookupFieldId) {
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
