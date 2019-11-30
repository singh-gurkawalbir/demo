import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import deepClone from 'lodash/cloneDeep';
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
    resourceId,
    connectionId,
    resourceType,
    flowId,
    arrayIndex,
    useSampleDataAsArray,
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
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const sampleData = useSelector(state => {
    if (!isPageGenerator) {
      return selectors.getSampleData(state, {
        flowId,
        resourceId,
        resourceType,
        stage: 'flowInput',
      });
    }
  });
  // constructing data
  const connectionCopy = deepClone(connection);
  const formattedSampleData = JSON.stringify(
    getFormattedSampleData({
      connection: connectionCopy,
      sampleData,
      useSampleDataAsArray,
      resourceType,
      resourceName,
    }),
    null,
    2
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
    const sampleDataTmp = sampleData || { myField: 'sample' };

    if (contentType === 'json')
      parsedRule = getJSONSampleTemplate(sampleDataTmp);
    else parsedRule = getXMLSampleTemplate(sampleDataTmp);
  }

  let lookupField;

  if (lookupFieldId) {
    lookupField = (
      <DynaLookupEditor
        id={lookupFieldId}
        label="Manage Lookups"
        value={lookups}
        onFieldChange={onFieldChange}
      />
    );
  }

  return (
    <Fragment>
      {showEditor && (
        <HttpRequestBodyEditorDialog
          contentType={contentType === 'json' ? 'json' : 'xml'}
          title="Build HTTP Request Body"
          id={`${resourceId}-${id}`}
          rule={parsedRule}
          onFieldChange={onFieldChange}
          lookups={lookups}
          data={formattedSampleData}
          onClose={handleClose}
          action={lookupField}
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
