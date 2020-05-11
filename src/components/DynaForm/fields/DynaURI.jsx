import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useState, useCallback, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
// import sampleTemplateUtil from '../../../utils/sampleTemplate';

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
    formContext,
    description,
    enableEditorV2 = true,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const isEditorV2Supported = useSelector(state => {
    if (enableEditorV2) {
      return selectors.isEditorV2Supported(state, resourceId, resourceType);
    }

    return false;
  });
  const { data: sampleData, templateVersion } = useSelector(state =>
    selectors.getEditorSampleData(state, {
      flowId,
      resourceId,
      fieldType: id,
    })
  );
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

  const loadEditorSampleData = useCallback(
    version => {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: 'flowInput',
          formValues: formContext.value,
          fieldType: id,
          isV2NotSupported: !enableEditorV2,
          requestedTemplateVersion: version,
        })
      );
    },
    [
      dispatch,
      enableEditorV2,
      flowId,
      formContext.value,
      id,
      resourceId,
      resourceType,
    ]
  );
  const handleEditorVersionToggle = useCallback(
    version => {
      loadEditorSampleData(version);
    },
    [loadEditorSampleData]
  );

  useEffect(() => {
    if (flowId && !isPageGenerator) {
      loadEditorSampleData();
    }
  }, [
    dispatch,
    flowId,
    formContext.value,
    id,
    isPageGenerator,
    loadEditorSampleData,
    resourceId,
    resourceType,
    showEditor,
  ]);

  return (
    <Fragment>
      {showEditor && (
        <div>
          <UrlEditorDialog
            title={editorTitle}
            id={id}
            data={JSON.stringify(sampleData, null, 2)}
            rule={value}
            onClose={handleClose}
            showVersionToggle={isEditorV2Supported}
            editorVersion={templateVersion}
            onVersionToggle={handleEditorVersionToggle}
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
