import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/RefreshOutlined';
import { FormContext } from 'react-forms-processor/dist';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import CodeEditor from '../../CodeEditor';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { isNewId } from '../../../utils/resource';

const useStyles = makeStyles(() => ({
  container: {
    height: '25vh',
    width: '80%',
  },
}));

function DynaRawData(props) {
  const classes = useStyles();
  const {
    defaultValue,
    label,
    mode,
    // id,
    // onFieldChange,
    resourceId,
    formContext,
    resourceType,
    isFTP,
  } = props;
  const [isRawDataSet, setIsRawDataSet] = useState(false);
  const dispatch = useDispatch();
  const { data: rawData, status } = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw')
  );
  const fetchRawData = useCallback(() => {
    dispatch(
      actions.sampleData.request(resourceId, resourceType, formContext.value)
    );
  }, [dispatch, resourceId, resourceType, formContext]);

  useEffect(() => {
    if (!isFTP && !isRawDataSet && !isNewId(resourceId)) {
      setIsRawDataSet(true);
      fetchRawData();
    }
  }, [isRawDataSet, rawData, resourceId, fetchRawData, isFTP]);

  const handleRefreshRawData = () => {
    fetchRawData();
  };

  return (
    <div>
      <Typography>{label}</Typography>
      <div className={classes.container}>
        <CodeEditor
          name="rawData"
          value={rawData || defaultValue}
          mode={mode || 'json'}
          readOnly
        />
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
