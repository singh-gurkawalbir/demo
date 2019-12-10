import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DynaAutoSuggest from './DynaAutoSuggest';
import getJSONPaths from '../../../utils/jsonPaths';

export default function DynaAutoSuggestFlowSampleData(props) {
  const {
    id,
    disabled,
    value = '',
    placeholder,
    onFieldChange,
    showAllSuggestions,
    label,
    autoFocus,
    flowId,
    resourceId,
  } = props;
  const dispatch = useDispatch();
  const sampleDataObj = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    })
  );
  const { data: extractFields } = sampleDataObj || {};
  const requestSampleData = useCallback(() => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'importMappingExtract',
        true
      )
    );
  }, [dispatch, flowId, resourceId]);

  useEffect(() => {
    if (!extractFields) {
      requestSampleData();
    }
  }, [extractFields, requestSampleData]);

  let formattedExtractFields = [];

  if (extractFields) {
    const extractPaths = getJSONPaths(extractFields);

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  const options = {
    suggestions: formattedExtractFields,
  };

  return (
    <DynaAutoSuggest
      id={id}
      disabled={disabled}
      value={value}
      placeholder={placeholder}
      onFieldChange={onFieldChange}
      showAllSuggestions={showAllSuggestions}
      label={label}
      labelName="name"
      valueName="id"
      autoFocus={autoFocus}
      options={options}
    />
  );
}
