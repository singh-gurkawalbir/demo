/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import { getParentResourceContext } from '../../../utils/connections';
import DynaHandlebarPreview from './DynaHandlebarPreview';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

export default function DynaHttpRequestBody_afe(props) {
  const {
    id,
    onFieldChange,
    value,
    resourceId,
    resourceType,
    flowId,
    arrayIndex,
    formKey,
    stage,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const {parentType, parentId} = getParentResourceContext(match.url);

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    // TODO: Give better name for arrayIndex
    if (typeof arrayIndex === 'number' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = [...value];

      valueTmp[arrayIndex] = rule;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, rule);
    }
  }, [arrayIndex, id, onFieldChange, value]);

  const flowDataStage = stage || (resourceType === 'exports' ? 'inputFilter' : 'postMapOutput');

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: flowDataStage,
      onSave: handleSave,
      parentType,
      parentId,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, flowDataStage, editorId, formKey, flowId, resourceId, resourceType, id, handleSave, parentType, parentId, history, match.url]);

  return (
    <DynaHandlebarPreview {...props} onEditorClick={handleEditorClick} />
  );
}
