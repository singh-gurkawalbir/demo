import { useState, useEffect, Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import CodeEditor from '../../../components/CodeEditor';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import ModalDialog from '../../ModalDialog';
import SqlQueryBuilderEditorDialog from '../../../components/AFE/SqlQueryBuilderEditor/Dialog';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  label: {
    fontSize: '12px',
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

  const handleUpdate = (shouldCommit, editorVal) => {
    if (shouldCommit) {
      const { template } = editorVal;

      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  const editorDialog = (
    <ModalDialog
      show
      handleClose={handleEditorClick}
      aria-labelledby="form-dialog-title">
      <div>{label}</div>
      <div className={classes.editorContainer}>
        <SqlQueryBuilderEditorDialog
          title="Sql Query"
          id={`${id}-inline`}
          rule={value}
          sampleData={JSON.stringify(sampleData, null, 2)}
          onClose={handleUpdate}
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
    <Fragment>
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
      </div>
    </Fragment>
  );
}
