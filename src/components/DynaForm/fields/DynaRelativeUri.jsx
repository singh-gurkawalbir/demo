import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormLabel, FormControl } from '@material-ui/core';
import * as selectors from '../../../reducers';
import UrlEditorDialog from '../../../components/AFE/UrlEditor/Dialog';
import getFormattedSampleData from '../../../utils/sampleData';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExpandWindowIcon from '../../icons/ExpandWindowIcon';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  exitButtonRelativeUrl: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-end',
    marginBottom: theme.spacing(1),
  },
  relativeUriWrapper: {
    flexDirection: `row !important`,
  },
  textField: {
    width: '100%',
  },
}));

// TODO(Aditya): remove this component and use DynaTextWithLookupExtract/RelativeURI after refractor
export default function DynaRelativeUri(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    connectionId,
    disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    resourceType,
    flowId,
    label,
    options = {},
  } = props;
  const resourceName = options.resourceName || props.resourceName;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
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

  const { data: sampleData } = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );
  const formattedSampleData = useMemo(
    () =>
      JSON.stringify(
        getFormattedSampleData({
          connection,
          sampleData,
          resourceType,
          resourceName,
        }),
        null,
        2
      ),
    [connection, resourceName, resourceType, sampleData]
  );

  useEffect(() => {
    // Request for sample data only incase of flow context
    // TODO : @Raghu Do we show default data in stand alone context?
    // What type of sample data is expected in case of Page generators
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

  const handleFieldChange = event => {
    const { value } = event.target;

    onFieldChange(id, value);
  };

  let description = '';
  const { type } = connection || {};

  if (type === 'http' || type === 'rest') {
    description = `Relative to: ${connection[type].baseURI}`;
  }

  return (
    <div className={classes.relativeUriWrapper}>
      {showEditor && (
        <UrlEditorDialog
          title="Relative URI Editor"
          id={id}
          data={formattedSampleData}
          rule={value}
          onClose={handleClose}
          disabled={disabled}
        />
      )}
      <div className={classes.textField}>
        <div className={classes.labelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>

        <FormControl className={classes.fieldWrapper}>
          <TextField
            key={id}
            name={name}
            className={classes.textField}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            error={!isValid}
            value={value}
            variant="filled"
            onChange={handleFieldChange}
          />
          <ErroredMessageComponent
            isValid={isValid}
            errorMessages={errorMessages}
            description={description}
          />
        </FormControl>
      </div>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.exitButtonRelativeUrl}>
        <ExpandWindowIcon />
      </ActionButton>
    </div>
  );
}
