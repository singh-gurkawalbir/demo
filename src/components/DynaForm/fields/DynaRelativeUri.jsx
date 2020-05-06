import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useState, useCallback, useMemo, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import DynaTextWithLookup from './DynaTextWithLookup';
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
const DynaRelativeUri = props => {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    value,
    editorTitle = 'Build Relative URI',
    resourceId,
    resourceType,
    flowId,
    options = {},
    formContext,
    arrayIndex,
    enableEditorV2 = true,
  } = props;
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const isEditorV2Supported = useSelector(state => {
    if (enableEditorV2) {
      return selectors.isEditorV2Supported(state, resourceId, resourceType);
    }

    return false;
  });
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  const { data: sampleData, templateVersion } = useSelector(state =>
    selectors.getEditorSampleData(state, {
      flowId,
      resourceId,
      fieldType: id,
    })
  );
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
          requestedTemplateVersion: enableEditorV2 ? version : 1,
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
  ]);

  const inputValue = useMemo(
    () =>
      options && typeof arrayIndex === 'number' && Array.isArray(value)
        ? value[arrayIndex]
        : value,
    [arrayIndex, options, value]
  );
  // const sampleRule = sampleTemplateUtil.getSampleRuleTemplate(resource);
  // const { type } = connection || {};

  // if (type === 'http' || type === 'rest') {
  //   description = `Relative to: ${connection[type].baseURI}`;
  // }
  return (
    <Fragment>
      {showEditor && (
        <div>
          <UrlEditorDialog
            title={editorTitle}
            id={id}
            data={JSON.stringify(sampleData, null, 2)}
            rule={inputValue}
            // sampleRule={sampleRule}
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

      <DynaTextWithLookup
        key={`text-${id}`}
        id={id}
        value={inputValue}
        {...props}
      />
    </Fragment>
  );
};

export default function RelativeUriWrapper(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaRelativeUri {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}
