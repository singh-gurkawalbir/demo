/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionButton from '../../ActionButton';
import AfeIcon from '../../icons/AfeIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import { getParentResourceContext } from '../../../utils/connections';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FLOW_DATA_STAGE } from '../../../utils/flowData';

const useStyles = makeStyles(theme => ({
  dynaURIActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaURIWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
}));

export default function DynaURI_afe(props) {
  const {
    id,
    onFieldChange,
    value = '',
    resourceId,
    resourceType,
    flowId,
    description,
    formKey,
    stage,
    mapper2RowKey,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const flowDataStage = stage || (resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FLOW_DATA_STAGE);

  const {parentType, parentId, connId: connectionId} = getParentResourceContext(match.url, resourceType);
  const { integrationId } = getParentResourceContext(match.url, 'integrations');

  const handleSave = useCallback(editorValues => {
    onFieldChange(id, editorValues.rule);
  }, [id, onFieldChange]);

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
      integrationId,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, flowDataStage, handleSave, parentType, parentId, connectionId, mapper2RowKey, integrationId, history, match.url]);

  return (
    <>
      <div className={classes.dynaURIWrapper}>
        <DynaTextWithFlowSuggestion
          description={description}
          id={id}
          value={value}
          stage={flowDataStage}
          {...props}
        />
        <ActionButton
          data-test={id}
          tooltip="Open handlebars editor"
          placement="bottom"
          onClick={handleEditorClick}
          className={classes.dynaURIActionButton}>
          <AfeIcon />
        </ActionButton>
      </div>
    </>
  );
}
