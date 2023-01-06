import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch, matchPath } from 'react-router-dom';
import DynaKeyValue from './DynaKeyValue';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { RESOURCE_DRAWER_PATH, CONN_DRAWER_PATH, ICLIENT_DRAWER_PATH } from '../../../utils/connections';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FLOW_DATA_STAGE } from '../../../utils/flowData';

export default function DynaIClientHeaders(props) {
  const {
    id,
    formKey,
    onFieldChange,
    resourceType,
    resourceId,
    flowId,
    value,
    stage,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();

  const editorId = getValidRelativePath(id);
  const flowDataStage = stage || (resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FLOW_DATA_STAGE);
  const {parentType, parentId, connectionId} = matchPath(match.url, {
    path: `/**${RESOURCE_DRAWER_PATH}${CONN_DRAWER_PATH}${ICLIENT_DRAWER_PATH}`,
    exact: true})?.params || {};

  const handleSave = useCallback(editorValues => {
    const {paramIndex, rule} = editorValues;
    const newValue = [...value];

    if (rule) {
      newValue[paramIndex] = {...newValue[paramIndex], value: rule};
    } else if (newValue[paramIndex]?.name) {
      delete newValue[paramIndex]?.value;
    } else {
      newValue.splice(paramIndex, 1);
    }

    onFieldChange(id, newValue);
  }, [id, onFieldChange, value]);
  const handleEditorClick = useCallback(index => {
    dispatch(actions.editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      parentType,
      parentId,
      connectionId,
      stage: flowDataStage,
      onSave: handleSave,
      paramIndex: index,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, parentType, parentId, connectionId, flowDataStage, handleSave, history, match.url]);

  return (
    <DynaKeyValue
      {...props}
      handleEditorClick={handleEditorClick}
    />
  );
}
