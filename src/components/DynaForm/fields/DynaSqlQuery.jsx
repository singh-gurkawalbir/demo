import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {makeStyles, FormLabel, FormHelperText} from '@material-ui/core';
import clsx from 'clsx';
import { isEqual } from 'lodash';
import CodeEditor from '../../CodeEditor';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import SqlQueryBuilderEditorDrawer from '../../AFE/SqlQueryBuilderEditor/Drawer';
import FieldHelp from '../FieldHelp';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';
import { getUniqueFieldId } from '../../../utils/editor';

const useStyles = makeStyles(theme => ({
  container: {
    overflowY: 'off',
  },
  label: {
    fontSize: '12px',
    marginTop: theme.spacing(1),
  },
  editorButton: {
    float: 'right',
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    height: theme.spacing(10),
  },
  dynaSqlQueryWrapper: {
    display: 'flex',
  },
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
}));

export default function DynaSqlQuery(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    id,
    resourceId,
    flowId,
    resourceType,
    onFieldChange,
    value,
    label,
    editorTitile,
    editorClassName,
    disabled,
    isValid,
    errorMessages,
    disableEditorV2,
    enableEditorV2,
  } = props;
  const fieldType = getUniqueFieldId(id);
  const handleOpenDrawer = usePushRightDrawer(id);

  const isEditorV2Supported = useSelector(state => {
    if (disableEditorV2) {
      return false;
    }

    return selectors.isEditorV2Supported(state, resourceId, resourceType, flowId, enableEditorV2);
  });
  const {
    data: sampleData,
    status: sampleDataRequestStatus,
    templateVersion,
  } = useSelector(state => {
    const sampleData = selectors.editorSampleData(state, { flowId, resourceId, fieldType });

    return selectors.sampleDataWrapper(state, {
      sampleData,
      flowId,
      resourceId,
      resourceType,
      fieldType,
      stage: 'flowInput',
    });
  }, isEqual);
  const loadEditorSampleData = useCallback(
    (version, stage) => {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: stage || 'flowInput',
          formKey: props.formKey,
          fieldType,
          isEditorV2Supported,
          requestedTemplateVersion: version,
        })
      );
    },
    [dispatch, flowId, fieldType, props.formKey, isEditorV2Supported, resourceId, resourceType]
  );
  const handleEditorVersionToggle = useCallback(
    version => {
      loadEditorSampleData(version);
    },
    [loadEditorSampleData]
  );

  useEffect(() => {
    if (flowId) {
      loadEditorSampleData();
    }
  }, [flowId, loadEditorSampleData]);

  const handleSave = useCallback((shouldCommit, editorVal) => {
    if (shouldCommit) {
      const { template } = editorVal;

      onFieldChange(id, template);
    }
  }, [id, onFieldChange]);

  const onChange = useCallback(value => onFieldChange(id, value), [
    id,
    onFieldChange,
  ]);

  return (
    <>
      <ActionButton
        data-test={id}
        onClick={handleOpenDrawer}
        className={classes.editorButton}>
        <ExitIcon />
      </ActionButton>
      <div className={classes.container}>
        <SqlQueryBuilderEditorDrawer
          title={editorTitile}
          id={`${id}-inline`}
          rule={value}
          sampleData={JSON.stringify(sampleData, null, 2)}
          onSave={handleSave}
          disabled={disabled}
          showDefaultData={false}
          path={id}
          isSampleDataLoading={sampleDataRequestStatus === 'requested'}
          showVersionToggle={isEditorV2Supported}
          editorVersion={templateVersion}
          onVersionToggle={handleEditorVersionToggle}
        />

        <div className={classes.dynaSqlQueryWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <div
          className={clsx(
            classes.inlineEditorContainer,
            editorClassName
          )}>
          <CodeEditor
            name={id}
            value={value}
            mode="sql"
            readOnly={disabled}
            onChange={onChange}
          />
        </div>
        {!isValid && <FormHelperText error>{errorMessages}</FormHelperText>}
      </div>
    </>
  );
}
