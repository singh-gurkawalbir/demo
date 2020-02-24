import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uniq } from 'lodash';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import getJSONPaths, { pickFirstObject } from '../../../utils/jsonPaths';
import DynaAutoSuggest from './DynaAutoSuggest';

export default function DynaNetSuiteSubRecordJsonPath(props) {
  const { resourceId, flowId } = props;
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, 'imports')
  );
  const dispatch = useDispatch();
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType: 'imports',
      stage: 'flowInput',
    })
  );

  useEffect(() => {
    if (flowId && !sampleData && !isPageGenerator) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, isPageGenerator, resourceId, sampleData]);

  const formattedExtractFields = [{ value: '$', label: '$' }];

  if (sampleData) {
    const extractPaths = getJSONPaths(pickFirstObject(sampleData));
    const arrayExtractPaths = [];

    extractPaths &&
      extractPaths
        .filter(obj => {
          if (obj.id.includes('[*].')) {
            return true;
          }

          return false;
        })
        .forEach(ep =>
          arrayExtractPaths.push(ep.id.substr(0, ep.id.lastIndexOf('[*].')))
        );
    uniq(arrayExtractPaths).forEach(ep =>
      formattedExtractFields.push({ value: ep, label: ep })
    );
  }

  return (
    <DynaAutoSuggest
      labelName="label"
      valueName="value"
      options={{ suggestions: formattedExtractFields }}
      {...props}
    />
  );
}
