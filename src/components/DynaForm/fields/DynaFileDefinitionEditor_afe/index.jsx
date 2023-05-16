/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { OutlinedButton } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import FieldHelp from '../../FieldHelp';
import { getValidRelativePath } from '../../../../utils/routePaths';
import FileDefinitionChange from './FileDefinitionChange';
import { safeParse } from '../../../../utils/string';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { selectors } from '../../../../reducers';

/*
 * This editor is shown in case of :
 *  1. In Export creation , when specific format is selected to fetch parser rules
 *  2. When editing an export, resource has a userDefinitionId using which we get rules
 *    customized and saved by user while creation
 */
const useStyles = makeStyles(() => ({
  fileDefinitionContainer: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
}));
// Afe will decide loggable aspects
export default function DynaFileDefinitionEditor_afe(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    id,
    label,
    resourceId,
    resourceType,
    onFieldChange,
    formKey,
    flowId,
  } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const editorType = resourceType === 'imports' ? 'structuredFileGenerator' : 'structuredFileParser';
  const importHasMappings = useSelector(state => selectors.resourceHasMappings(state, resourceId));

  const handleSave = useCallback(editorValues => {
    const { rule, lastValidData } = editorValues;

    // Trigger sample Data update on resource
    const patchSet = [
      {
        op: 'replace',
        path: '/sampleData',
        value: resourceType === 'imports' ? safeParse(lastValidData) : lastValidData,
      },
    ];

    dispatch(actions.resource.patchStaged(resourceId, patchSet));

    // It calls processor on final rules to parse file
    // @raghu this would also need to be removed once auto sample data update changes are done

    dispatch(actions.resourceFormSampleData.request(formKey));
    // update rules against this field each time it gets saved
    if (rule) {
      onFieldChange(id, rule);
    }
  }, [resourceType, dispatch, resourceId, formKey, onFieldChange, id]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, editorType, {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      onSave: handleSave,
      stage: importHasMappings ? 'postMapOutput' : '',
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, flowId, formKey, handleSave, history, id, match.url, editorType, resourceId, resourceType, importHasMappings]);

  return (
    <>
      <div className={classes.fileDefinitionContainer}>
        <LoadResources resources="filedefinitions">
          {/* todo: FileDefinitionChange is a temporary hack until Raghu's changes are
        done re dispatching of SAMPLEDATA_UPDATED action to update editor sample data and rule when
        network call for received prebuilt definition is completed */}
          <FileDefinitionChange
            editorId={editorId} formKey={formKey} fieldId={id}
            resourceId={resourceId}
            resourceType={resourceType}
            importHasMappings={importHasMappings} />
          <div>
            <div>
              <FormLabel>
                {label}
              </FormLabel>
              <FieldHelp {...props} />
            </div>
            <OutlinedButton
              color="secondary"
              sx={{mr: 0.5}}
              onClick={handleEditorClick}>
              Launch
            </OutlinedButton>
          </div>
        </LoadResources>
      </div>
    </>
  );
}
