import React from 'react';
import { useSelector } from 'react-redux';
import { uniq } from 'lodash';
import { selectors } from '../../../reducers';
import getJSONPaths, { pickFirstObject } from '../../../utils/jsonPaths';
import { IMPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';
import DynaAutoSuggest from './DynaAutoSuggest';

export default function DynaNetSuiteSubRecordJsonPath(props) {
  const { resourceId, flowId } = props;
  const sampleData = useSelector(state =>
    selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType: 'imports',
      stage: IMPORT_FILTERED_DATA_STAGE,
    }).data
  );

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
