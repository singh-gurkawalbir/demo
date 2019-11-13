import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { isEmpty } from 'lodash';
import * as selectors from '../../../reducers';
import HttpRequestBodyEditorDialog from '../../../components/AFE/HttpRequestBodyEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';
import {
  getXMLSampleTemplate,
  getJSONSampleTemplate,
} from '../../AFE/HttpRequestBodyEditor/templateMapping';
import actions from '../../../actions';
import jsonUtil from '../../../utils/json';

export default function DynaHttpRequestBody(props) {
  const {
    id,
    onFieldChange,
    options,
    value,
    label,
    resourceId,
    connectionId,
    resourceType,
    flowId,
    useSampleDataAsArray,
  } = props;
  const { lookups: lookupsObj, saveIndex, contentType, resourceName } = options;
  const [showEditor, setShowEditor] = useState(false);
  let parsedRule =
    options && typeof saveIndex === 'number' && Array.isArray(value)
      ? value[saveIndex]
      : value;
  const lookupFieldId = lookupsObj && lookupsObj.fieldId;
  const lookups = lookupsObj && lookupsObj.data;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const connectionData = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'flowInput', {
      isImport: resourceType === 'imports',
    })
  );
  // constructing data
  const data = {
    connection: {},
    data: {
      myField: 'sample',
    },
  };

  if (connectionData) {
    data.connection.name = connectionData.name;
    const connSubDoc = connectionData[connectionData.type];
    const hbSubDoc = {};

    if (connSubDoc) {
      if (connSubDoc.unencrypted && !isEmpty(connSubDoc.unencrypted)) {
        hbSubDoc.unencrypted = connSubDoc.unencrypted;
      }

      if (connSubDoc.encrypted && !isEmpty(connSubDoc.encrypted)) {
        hbSubDoc.encrypted = jsonUtil.maskValues(connSubDoc.encrypted);
      }
    }

    data.connection[connectionData.type] = hbSubDoc;
  }

  if (sampleData) {
    data.data = useSampleDataAsArray ? [sampleData] : sampleData;
  }

  data[resourceType === 'imports' ? 'import' : 'export'] = {
    name: resourceName,
  };

  const stringifiedData = JSON.stringify(data, null, 2);

  useEffect(() => {
    // Request for sample data only incase of flow context
    // TODO : @Raghu Do we show default data in stand alone context?
    // What type of sample data is expected in case of Page generators
    if (flowId && !sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (typeof saveIndex === 'number' && Array.isArray(value)) {
        // save to array at position saveIndex
        const valueTmp = value;

        valueTmp[saveIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  if (!parsedRule && sampleData) {
    if (contentType === 'json') parsedRule = getJSONSampleTemplate(sampleData);
    else parsedRule = getXMLSampleTemplate(sampleData);
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
          data={stringifiedData}
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
