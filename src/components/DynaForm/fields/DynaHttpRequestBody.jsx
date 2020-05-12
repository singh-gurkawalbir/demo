import { useState, useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormControl, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../reducers';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';
import actions from '../../../actions';
import getFormattedSampleData from '../../../utils/sampleData';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  dynaHttpReqWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  dynaHttpFormControl: {
    display: 'flex',
    flexDirection: 'column',
  },
  dynaHttpLabel: {
    marginRight: 12,
    marginBottom: 0,
  },
  httpReqbtn: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function DynaHttpRequestBody(props) {
  const classes = useStyles();
  const {
    id,
    onFieldChange,
    options = {},
    value,
    label,
    title,
    resultTitle,
    ruleTitle,
    dataTitle,
    resourceId,
    connectionId,
    resourceType,
    flowId,
    arrayIndex,
  } = props;
  const { lookups: lookupsObj, resourceName } = options;
  const contentType = options.contentType || props.contentType;
  const [showEditor, setShowEditor] = useState(false);
  let parsedRule =
    options && typeof arrayIndex === 'number' && Array.isArray(value)
      ? value[arrayIndex]
      : value;
  const lookupFieldId = lookupsObj && lookupsObj.fieldId;
  const lookups = lookupsObj && lookupsObj.data;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );
  const { adaptorType } = resource.merged || {};
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const { data: sampleData } = useSelector(state => {
    if (!['exports', 'imports'].includes(resourceType)) return {};

    return selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    });
  });
  // constructing data
  const wrapSampleDataInArray =
    adaptorType === 'HTTPImport' || adaptorType === 'HTTPExport';
  const formattedSampleData = useMemo(
    () =>
      getFormattedSampleData({
        connection,
        sampleData,
        resourceType,
        resourceName,
        wrapInArray: wrapSampleDataInArray,
      }),
    [connection, resourceName, resourceType, sampleData, wrapSampleDataInArray]
  );
  const stringifiedSampleData = useMemo(
    () => JSON.stringify(formattedSampleData, null, 2),
    [formattedSampleData]
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

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (typeof arrayIndex === 'number' && Array.isArray(value)) {
        // save to array at position arrayIndex
        const valueTmp = value;

        valueTmp[arrayIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  if (!parsedRule) {
    if (contentType === 'json')
      parsedRule = getJSONSampleTemplate(formattedSampleData.data);
    else parsedRule = getXMLSampleTemplate(formattedSampleData.data);
  }

  let lookupField;
  const lookupOptions = {
    isSQLLookup: false,
    sampleData: formattedSampleData,
    resourceId,
    resourceType,
    flowId,
    connectionId,
    resourceName,
  };

  if (lookupFieldId) {
    lookupField = (
      <DynaLookupEditor
        id={lookupFieldId}
        label="Manage Lookups"
        value={lookups}
        onFieldChange={onFieldChange}
        options={lookupOptions}
      />
    );
  }

  return (
    <Fragment>
      {showEditor && (
        <HttpRequestBodyEditorDialog
          contentType={contentType === 'json' ? 'json' : 'xml'}
          title={title || 'Build HTTP Request Body'}
          id={`${resourceId}-${id}`}
          rule={parsedRule}
          onFieldChange={onFieldChange}
          lookups={lookups}
          data={stringifiedSampleData}
          onClose={handleClose}
          action={lookupField}
          ruleTitle={ruleTitle}
          dataTitle={dataTitle}
          resultTitle={resultTitle}
        />
      )}
      <FormControl className={classes.dynaHttpFormControl}>
        <div className={classes.dynaHttpReqWrapper}>
          <FormLabel htmlFor={id} className={classes.dynaHttpLabel}>
            HTTP body:
          </FormLabel>

          {/* Todo: Aditya 
           HTTP body If HTTP body not clicked, show "Configure body" as label of the button. If clicked, show AFE. If no changes on save, show Configure body. If saves changes, show "Edit body" as the label of the button. */}

          <Button
            data-test={id}
            variant="outlined"
            color="secondary"
            className={classes.httpReqbtn}
            onClick={handleEditorClick}>
            {label}
          </Button>
          <FieldHelp {...props} />
        </div>
        <ErroredMessageComponent {...props} />
      </FormControl>
    </Fragment>
  );
}
