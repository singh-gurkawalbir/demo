import { useState, useEffect, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

export default function DynaCsvParseSampleDataUpdate(props) {
  const { resourceId, resourceType, options = {} } = props;
  const dispatch = useDispatch();
  const [csvOptions, setCsvOptions] = useState(options);
  const [wait, setWait] = useState(0);
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const { csvData } = useSelector(state => {
    const { data: rawData, status } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    if (!status) {
      // Incase of resource edit and no file uploaded, show the csv content uploaded last time ( sampleData )
      const resource = selectors.resource(state, resourceType, resourceId);

      // If the file type is csv before , only then retrieve its content sampleData to show in the editor
      if (resource && resource.file && resource.file.type === 'csv') {
        return { csvData: resource.sampleData };
      }
    }

    return { csvData: rawData && rawData.body };
  });
  const fetchApi = useCallback((values) => {
    dispatch(
      actions.sampleData.request(
        resourceId,
        resourceType,
        {
          type: 'csv',
          file: csvData,
          editorValues: values,
        },
        'file'
      )
    );
  }, [csvData, dispatch, resourceId, resourceType]);

  useEffect(() => {
    // ..compare options and localOptions
    // compare if option changed
    if (!isEqual(csvOptions, options)) {
      if (wait) {
        clearTimeout(wait);
      }

      setCsvOptions(options);
      setWait(
        setTimeout(() => {
          fetchApi(options);
        }, 500)
      );
    }
  }, [csvOptions, fetchApi, options, wait]);

  return null;
}
