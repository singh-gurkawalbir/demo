import { useState, useCallback, useEffect, useMemo, Fragment } from 'react';
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
// import getFormattedSampleData from '../../../utils/sampleData';
import ErroredMessageComponent from './ErroredMessageComponent';

const ManageLookup = props => {
  const {
    label = 'Manage Lookups',
    lookupFieldId,
    value,
    onFieldChange,
    options = {},
  } = props;

  return (
    <DynaLookupEditor
      id={lookupFieldId}
      label={label}
      value={value}
      onFieldChange={onFieldChange}
      options={options}
    />
  );
};

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
  const lookupFieldId = lookupsObj && lookupsObj.fieldId;
  const lookups = lookupsObj && lookupsObj.data;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const { data: sampleData, status, fieldEditorVersion } = useSelector(
    state => {
      if (!['exports', 'imports'].includes(resourceType)) return {};

      return selectors.getEditorSampleData(state, {
        flowId,
        resourceId,
        fieldType: id,
      });
    }
  );

  useEffect(() => {
    if (flowId && !status && !isPageGenerator) {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: 'flowInput',
          fieldType: id,
        })
      );
    }
  }, [dispatch, flowId, id, isPageGenerator, resourceId, resourceType, status]);

  const handleEditorVersionToggle = useCallback(
    version => {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: 'flowInput',
          fieldType: id,
          requestedEditorVersion: version,
        })
      );
    },
    [dispatch, flowId, id, resourceId, resourceType]
  );
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

  const formattedRule = useMemo(() => {
    let rule = Array.isArray(value) ? value[arrayIndex] : value;

    if (!rule) {
      // load sample template when rule is not yet defined
      if (contentType === 'json') rule = getJSONSampleTemplate(sampleData);
      else rule = getXMLSampleTemplate(sampleData);
    }

    return rule;
  }, [arrayIndex, contentType, sampleData, value]);
  const action = useMemo(() => {
    if (!lookupFieldId) return;
    const options = {
      isSQLLookup: false,
      sampleData,
      resourceId,
      resourceType,
      flowId,
      connectionId,
      resourceName,
    };

    return ManageLookup({
      label: 'Manage Lookups',
      lookupFieldId,
      value: lookups,
      onFieldChange,
      options,
    });
  }, [
    connectionId,
    flowId,
    lookupFieldId,
    lookups,
    onFieldChange,
    resourceId,
    resourceName,
    resourceType,
    sampleData,
  ]);

  return (
    <Fragment>
      {showEditor && (
        <div key={fieldEditorVersion}>
          <HttpRequestBodyEditorDialog
            contentType={contentType === 'json' ? 'json' : 'xml'}
            title={title || 'Build HTTP Request Body'}
            id={`${resourceId}-${id}`}
            rule={formattedRule}
            onFieldChange={onFieldChange}
            lookups={lookups}
            data={JSON.stringify(sampleData, null, 2)}
            onClose={handleClose}
            action={action}
            ruleTitle={ruleTitle}
            dataTitle={dataTitle}
            resultTitle={resultTitle}
            showVersionToggle
            editorVersion={fieldEditorVersion}
            onVersionToggle={handleEditorVersionToggle}
          />
        </div>
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
}
