import { useState, useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';
import actions from '../../../actions';
import getFormattedSampleData from '../../../utils/sampleData';

export default function DynaHttpRequestBody(props) {
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
  const resource = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const { adaptorType } = resource.merged || {};
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
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
