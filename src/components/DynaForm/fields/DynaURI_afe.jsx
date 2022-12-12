/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory, useRouteMatch, matchPath } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionButton from '../../ActionButton';
import AfeIcon from '../../icons/AfeIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import { getParentResourceContext, RESOURCE_DRAWER_PATH, CONN_DRAWER_PATH, ICLIENT_DRAWER_PATH } from '../../../utils/connections';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

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
  const flowDataStage = stage || (resourceType === 'exports' ? 'inputFilter' : 'importMappingExtract');

  let parentIds = getParentResourceContext(match.url);

  if (resourceType === 'iClients') {
    parentIds = matchPath(match.url, {
      path: `/**${RESOURCE_DRAWER_PATH}${CONN_DRAWER_PATH}${ICLIENT_DRAWER_PATH}`,
      exact: true})?.params || {};
  }

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
      parentType: parentIds.parentType,
      parentId: parentIds.parentId,
      connectionId: parentIds.connId,
      mapper2RowKey,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, flowDataStage, handleSave, parentIds.parentType, parentIds.parentId, parentIds.connId, mapper2RowKey, history, match.url]);

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
