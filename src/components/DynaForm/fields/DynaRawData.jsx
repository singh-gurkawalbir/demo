import { Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import { FormContext } from 'react-forms-processor/dist';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { isNewId } from '../../../utils/resource';

function DynaRawData(props) {
  const {
    label,
    id,
    onFieldChange,
    resourceId,
    formContext,
    resourceType,
  } = props;
  const [isRawDataSet, setIsRawDataSet] = useState(false);
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw')
  );
  /*
   * Fetches raw data by making a preview call
   * @param fetchFromDB : Boolean
   * Determines to fetch rawdata either from saved ( incase of edit ) or from actual end point
   */
  const fetchRawData = useCallback(
    fetchFromDB => {
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          formContext.value,
          undefined,
          fetchFromDB
        )
      );
    },
    [dispatch, resourceId, resourceType, formContext]
  );

  useEffect(() => {
    // Fetches raw data incase of initial load of an edit export mode
    if (!isRawDataSet && !isNewId(resourceId)) {
      setIsRawDataSet(true);
      fetchRawData(true);
    }
  }, [isRawDataSet, rawData, resourceId, fetchRawData]);

  useEffect(() => {
    // Updates rawdata against field id each time it gets updated
    if (rawData) {
      onFieldChange(id, rawData);
    }
    // @TODO Should add onFieldChange as Dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, rawData]);
  const handleRefreshRawData = () => {
    fetchRawData();
  };

  return (
    <div>
      <Typography>{label}</Typography>
      <div>
        {status === 'requested' && <Spinner />}
        {status !== 'requested' && (
          <RefreshIcon onClick={handleRefreshRawData} />
        )}
      </div>
    </div>
  );
}

const DynaRawDataWithFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <DynaRawData {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaRawDataWithFormContext;
