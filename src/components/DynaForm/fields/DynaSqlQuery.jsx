import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {makeStyles, FormLabel, FormHelperText} from '@material-ui/core';
import clsx from 'clsx';
import CodeEditor from '../../CodeEditor';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import SqlQueryBuilderEditorDrawer from '../../AFE/SqlQueryBuilderEditor/Drawer';
import FieldHelp from '../FieldHelp';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

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
  } = props;
  const handleOpenDrawer = usePushRightDrawer(id);

  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const { data: sampleData } = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );

  useEffect(() => {
    if (flowId && !sampleData && !isPageGenerator) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, isPageGenerator, resourceId, resourceType, sampleData]);

  const handleSave = (shouldCommit, editorVal) => {
    if (shouldCommit) {
      const { template } = editorVal;

      onFieldChange(id, template);
    }
  };

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
