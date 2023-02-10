/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import { getParentResourceContext} from '../../../utils/connections';
import DynaHandlebarPreview from './DynaHandlebarPreview';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_POST_MAPPED_DATA_STAGE } from '../../../utils/flowData';

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
    mapper2RowKey,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const {parentType, parentId, connId: connectionId} = getParentResourceContext(match.url, resourceType);

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

  const flowDataStage = stage || (resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_POST_MAPPED_DATA_STAGE);

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
      connectionId,
      mapper2RowKey,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, flowDataStage, handleSave, parentType, parentId, connectionId, mapper2RowKey, history, match.url]);

  return (
    <DynaHandlebarPreview {...props} onEditorClick={handleEditorClick} />
  );
}
