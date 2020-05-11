import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useState, useCallback, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
import DynaEditorWithFlowSampleData from './DynaEditorWithFlowSampleData';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));
const DynaURI = props => {
  const {
    id,
    onFieldChange,
    value,
    editorTitle,
    resourceId,
    resourceType,
    flowId,
    description,
    enableEditorV2 = true,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const handleEditorClick = useCallback(() => {
    setShowEditor(!showEditor);
  }, [showEditor]);
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <div>
          <DynaEditorWithFlowSampleData
            title={editorTitle}
            fieldId={id}
            onClose={handleClose}
            editorType="url"
            flowId={flowId}
            resourceId={resourceId}
            resourceType={resourceType}
            enableEditorV2={enableEditorV2}
            rule={value}
          />
        </div>
      )}
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButton}>
        <ExitIcon />
      </ActionButton>

      <DynaTextWithFlowSuggestion
        description={description}
        key={`text-${id}`}
        id={id}
        value={value}
        {...props}
      />
    </Fragment>
  );
};

export default function DynaURIWrapper(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaURI {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}
