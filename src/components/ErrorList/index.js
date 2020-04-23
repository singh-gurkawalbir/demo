import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import list from './list';
import actions from '../../actions';
import { getSampleDataWrapper } from '../../reducers';
import CeligoTable from '../CeligoTable';
import metadata from './metadata';

export default function ErrorList() {
  const dispatch = useDispatch();
  const size = 15;
  const [errorList, setErrorList] = useState(list.errors.slice(0, size));
  const [count, setCount] = useState(size);
  const exportId = '5cb5b1f108eac23dd4ebe62c';
  const flowId = '5e0995566672d67d7a952eb1';
  const { status: sampleDataStatus } = useSelector(state =>
    getSampleDataWrapper(state, {
      flowId,
      resourceId: exportId,
      resourceType: 'exports',
      stage: 'transform',
    })
  );

  useEffect(() => {
    if (sampleDataStatus === 'received') {
      const newErrorList = [
        ...errorList,
        ...list.errors.slice(count, count + size),
      ];

      setErrorList(newErrorList);
      setCount(count + size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sampleDataStatus]);

  const fetchMoreData = useCallback(() => {
    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        exportId,
        'exports',
        'transform'
      )
    );
  }, [dispatch]);

  return (
    <InfiniteScroll
      dataLength={errorList.length}
      next={fetchMoreData}
      hasMore
      height={660}
      loader={<h4>Loading...</h4>}>
      <CeligoTable data={errorList} filterKey="errorList" {...metadata} />
    </InfiniteScroll>
  );
}
