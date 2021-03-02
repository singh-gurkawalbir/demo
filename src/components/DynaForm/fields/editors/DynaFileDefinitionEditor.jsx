import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Button, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileDefinitionEditorDrawer from '../../../AFE/FileDefinitionEditor/Drawer';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import {
  FILE_GENERATOR,
  FILE_PARSER,
} from '../../../AFE/FileDefinitionEditor/constants';
import useFormContext from '../../../Form/FormContext';
import FieldHelp from '../../FieldHelp';
import { safeParse } from '../../../../utils/string';
import usePushRightDrawer from '../../../../hooks/usePushRightDrawer';

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

/**
 * a util function to get resourcePath based on value / defaultPath
 * If user updated resourcePath, returns path from the value
 * Initially, returns resourcePath on saved resource
 */
function extractResourcePath(value, initialResourcePath) {
  if (value) {
    const jsonValue = safeParse(value) || {};

    return jsonValue.resourcePath;
  }

  return initialResourcePath;
}

/**
 * @props
 * userDefinitionId : If the resource already has saved fileDefition, corresponding Id is passed
 * fileDefinitionResourcePath : same as above, contains saved resourcePath
 * options: format & definitionId selected in the form is passed through OptionsHandler as options
 */
export default function DynaFileDefinitionEditor(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    id,
    label,
    resourceId,
    resourceType,
    onFieldChange,
    fileDefinitionResourcePath,
    userDefinitionId,
    options = {},
    value,
    disabled,
    formKey,
  } = props;

  const formContext = useFormContext(formKey);
  const { format, definitionId } = options;
  const resourcePath = extractResourcePath(value, fileDefinitionResourcePath);
  const [isRuleChanged, setIsRuleChanged] = useState(false);
  const handleOpenDrawer = usePushRightDrawer(id);

  // Default values
  const parserType =
    resourceType === 'imports'
      ? 'fileDefinitionGenerator'
      : 'fileDefinitionParser';
  const processor = resourceType === 'imports' ? FILE_GENERATOR : FILE_PARSER;

  // selector to fetch file definition sample data
  const { sampleData, rule } = useSelector(state => selectors.fileDefinitionSampleData(state, {
    userDefinitionId,
    resourceType,
    options: { format, definitionId, resourcePath },
  }), shallowEqual);

  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { data, rule } = editorValues;

      // On change of rules, trigger sample data update
      // It calls processor on final rules to parse csv file
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: parserType,
            file: data,
            editorValues,
            formValues: formContext.value,
          },
          'file'
        )
      );

      // update rules against this field each time it gets saved
      if (rule) {
        onFieldChange(id, rule);
      }
    }
  }, [dispatch, formContext.value, id, onFieldChange, parserType, resourceId, resourceType]);

  // Effects to update values and sample data
  useEffect(() => {
    if (isRuleChanged) {
      onFieldChange(id, rule, true);
      // Processes the updated sample data and rules on change of format
      if (sampleData) {
        dispatch(
          actions.sampleData.request(
            resourceId,
            resourceType,
            {
              type: parserType,
              file: sampleData,
              editorValues: { rule, data: sampleData },
              formValues: formContext.value,
            },
            'file'
          )
        );
      }
      setIsRuleChanged(false);
    }
  }, [
    dispatch,
    formContext.value,
    id,
    isRuleChanged,
    onFieldChange,
    parserType,
    resourceId,
    resourceType,
    rule,
    sampleData,
  ]);
  useEffect(() => {
    if (rule) {
      setIsRuleChanged(true);
    }
  }, [rule]);

  return (
    <>
      <div className={classes.fileDefinitionContainer}>
        <LoadResources resources="filedefinitions">
          <FileDefinitionEditorDrawer
            title={label}
            id={id + resourceId}
            processor={processor}
            data={
                sampleData ||
                (resourceType === 'exports'
                  ? props.sampleData
                  : JSON.stringify(props.sampleData, null, 2))
              }
            rule={value}
            onSave={handleSave}
            disabled={disabled}
            path={id}
            />
          <div>

            <div>
              <FormLabel>
                {label}
              </FormLabel>
              <FieldHelp {...props} />
            </div>

            <Button
              variant="outlined"
              color="secondary"
              className={classes.fileDefinitionBtn}
              onClick={handleOpenDrawer}>
              Launch
            </Button>
          </div>

        </LoadResources>
      </div>
    </>
  );
}
