/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import FieldHelp from '../../FieldHelp';
import { getValidRelativePath } from '../../../../utils/routePaths';
import FileDefinitionChange from './FileDefinitionChange';
import { OutlinedButton } from '../../../Buttons';

/*
 * This editor is shown in case of :
 *  1. In Export creation , when specific format is selected to fetch parser rules
 *  2. When editing an export, resource has a userDefinitionId using which we get rules
 *    customized and saved by user while creation
 */
const useStyles = makeStyles(theme => ({
  fileDefinitionContainer: {
    flexDirection: 'row !important',
    width: '100%',
    alignItems: 'center',
  },
  fileDefinitionBtn: {
    marginRight: theme.spacing(0.5),
  },
}));

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

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    // Trigger sample Data update on resource
    const patchSet = [
      {
        op: 'replace',
        path: '/sampleData',
        value: editorValues?.lastValidData,
      },
    ];

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));

    dispatch(actions.resource.commitStaged(resourceType, resourceId, 'value'));

    // It calls processor on final rules to parse file
    // @raghu this would also need to be removed once auto sample data update changes are done

    dispatch(actions.resourceFormSampleData.request(formKey, {lastValidData: editorValues?.lastValidData}));
    // update rules against this field each time it gets saved
    if (rule) {
      onFieldChange(id, rule);
    }
  }, [dispatch, resourceId, resourceType, formKey, onFieldChange, id]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, editorType, {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, editorId, flowId, formKey, handleSave, history, id, match.url, editorType, resourceId, resourceType]);

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
            resourceType={resourceType} />
          <div>
            <div>
              <FormLabel>
                {label}
              </FormLabel>
              <FieldHelp {...props} />
            </div>
            <OutlinedButton
              color="secondary"
              className={classes.fileDefinitionBtn}
              onClick={handleEditorClick}>
              Launch
            </OutlinedButton>
          </div>
        </LoadResources>
      </div>
    </>
  );
}
