// /* eslint-disable camelcase */
import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import ActionButton from '../../../ActionButton';
import AfeIcon from '../../../icons/AfeIcon';
import InputField from '../DynaTextWithFlowSuggestion';
import AutoSuggest from '../DynaAutoSuggest';
import actions from '../../../../actions';
import { getValidRelativePath } from '../../../../utils/routePaths';
import { getParentResourceContext } from '../../../../utils/connections';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FLOW_DATA_STAGE } from '../../../../utils/flowData';

const useStyles = makeStyles(theme => ({
  dynaPathParamActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaPathParamWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
}));

export default function DynaHFAssistantPathParams(props) {
  const {
    id,
    onFieldChange,
    value,
    resourceId,
    resourceType,
    flowId,
    description,
    formKey,
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const flowDataStage = (resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FLOW_DATA_STAGE);

  const {parentType, parentId, connId: connectionId} = getParentResourceContext(match.url, resourceType);

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
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, flowDataStage, handleSave, parentType, parentId, connectionId, history, match.url]);

  return (
    <>
      <div className={classes.dynaPathParamWrapper}>
        {!isEmpty(options) ? (
          <AutoSuggest
            description={description}
            id={id}
            value={value}
            stage={flowDataStage}
            placeholder="Please select"
            showAllSuggestions
            {...props}
            />
        )
          : (
            <InputField
              {...props}
              showExtract={false}
              description={description}
              id={id}
              value={value}
              stage={flowDataStage}
            />
          )}
        <ActionButton
          data-test={id}
          tooltip="Open handlebars editor"
          placement="bottom"
          onClick={handleEditorClick}
          className={classes.dynaPathParamActionButton}>
          <AfeIcon />
        </ActionButton>
      </div>
    </>
  );
}
