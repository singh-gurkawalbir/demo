import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FormHelperText from '@material-ui/core/FormHelperText';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import CodeEditor from '../../CodeEditor';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import ModalDialog from '../../ModalDialog';
import SqlQueryBuilderEditorDrawer from '../../AFE/SqlQueryBuilderEditor/Drawer';

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
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
}));

export default function DynaSqlQuery(props) {
  const dispatch = useDispatch();
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    id,
    resourceId,
    flowId,
    resourceType,
    onFieldChange,
    value,
    label,
    editorClassName,
    disabled,
    isValid,
    errorMessages,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

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

  const editorDialog = (
    <ModalDialog
      show
      handleClose={handleEditorClick}
      aria-labelledby="form-dialog-title">
      <div>{label}</div>
      <div className={classes.editorContainer}>
        <SqlQueryBuilderEditorDrawer
          title="SQL Query"
          id={`${id}-inline`}
          rule={value}
          sampleData={JSON.stringify(sampleData, null, 2)}
          onSave={handleSave}
          onClose={handleEditorClick}
          disabled={disabled}
          showDefaultData={false}
        />
      </div>
    </ModalDialog>
  );
  const onChange = useCallback(value => onFieldChange(id, value), [
    id,
    onFieldChange,
  ]);

  return (
    <>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButton}>
        <ExitIcon />
      </ActionButton>
      <div className={classes.container}>
        {showEditor && editorDialog}

        <FormLabel className={classes.label}>{label}</FormLabel>

        <div
          className={classNames(
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
