
import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import defaultRef from './metadata';
import FlowStepName from './cells/FlowStepName';
import FlowStepStatus from './cells/FlowStepStatus';
import { JOB_STATUS, JOB_TYPES } from '../../../constants';
import ErrorCell from '../../JobDashboard/RunHistory/ErrorCell';
import HeaderWithHelpText from '../commonCells/HeaderWithHelpText';

describe('metdata flows test cases', () => {
  test('should pass the initial render with default value', () => {
    const columns = defaultRef.useColumns();
    const jobdata = {
      _flowId: '634d67d93b8a451127bb6c0d',
      createdAt: '2022-10-18T06:47:55.741Z',
      duration: '00:00:40',
      endedAt: '2022-10-18T06:48:36.672Z',
      lastExecutedAt: '2022-10-18T06:48:36.672Z',
      lastModified: '2022-10-18T06:48:36.673Z',
      name: 'AutomationStandaloneImport__ezyPOFUSHg',
      numIgnore: 0,
      numOpenError: 0,
      numPagesGenerated: 0,
      numPagesProcessed: 1,
      numResolved: 0,
      numSuccess: 1,
      startedAt: '2022-10-18T06:47:55.741Z',
      status: JOB_STATUS.COMPLETED,
      type: JOB_TYPES.IMPORT,
    };
    const jobdata1 = {
      _exportId: '634c8ee0e2679149601038ea',
      numOpenError: 0,
      numPagesGenerated: 0,
      numPagesProcessed: 1,
      type: JOB_TYPES.EXPORT,
      uiStatus: 'completed',
    };

    const value1Ref = columns[0].Value({
      rowData: jobdata,
    });

    expect(value1Ref).toEqual(
      <FlowStepName
        job={{
          _flowId: '634d67d93b8a451127bb6c0d',
          createdAt: '2022-10-18T06:47:55.741Z',
          duration: '00:00:40',
          endedAt: '2022-10-18T06:48:36.672Z',
          lastExecutedAt: '2022-10-18T06:48:36.672Z',
          lastModified: '2022-10-18T06:48:36.673Z',
          name: 'AutomationStandaloneImport__ezyPOFUSHg',
          numIgnore: 0,
          numOpenError: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          numResolved: 0,
          numSuccess: 1,
          startedAt: '2022-10-18T06:47:55.741Z',
          status: JOB_STATUS.COMPLETED,
          type: JOB_TYPES.IMPORT,
        }}
      />
    );

    const value2Ref = columns[1].Value({
      rowData: jobdata,
    });

    expect(value2Ref).toEqual(
      <FlowStepStatus
        job={{
          _flowId: '634d67d93b8a451127bb6c0d',
          createdAt: '2022-10-18T06:47:55.741Z',
          duration: '00:00:40',
          endedAt: '2022-10-18T06:48:36.672Z',
          lastExecutedAt: '2022-10-18T06:48:36.672Z',
          lastModified: '2022-10-18T06:48:36.673Z',
          name: 'AutomationStandaloneImport__ezyPOFUSHg',
          numIgnore: 0,
          numOpenError: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          numResolved: 0,
          numSuccess: 1,
          startedAt: '2022-10-18T06:47:55.741Z',
          status: JOB_STATUS.COMPLETED,
          type: JOB_TYPES.IMPORT,
        }}
      />
    );

    const value3Ref = columns[2].Value({
      rowData: jobdata,
    });

    expect(value3Ref).toBe(1);
    const value4Ref = columns[3].Value({
      rowData: jobdata,
    });

    expect(value4Ref).toBe(0);
    const value5Ref = columns[4].Value({
      rowData: jobdata,
    });

    expect(value5Ref).toEqual(
      <ErrorCell
        isLatestJob
        job={{
          _flowId: '634d67d93b8a451127bb6c0d',
          createdAt: '2022-10-18T06:47:55.741Z',
          duration: '00:00:40',
          endedAt: '2022-10-18T06:48:36.672Z',
          lastExecutedAt: '2022-10-18T06:48:36.672Z',
          lastModified: '2022-10-18T06:48:36.673Z',
          name: 'AutomationStandaloneImport__ezyPOFUSHg',
          numIgnore: 0,
          numOpenError: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 1,
          numResolved: 0,
          numSuccess: 1,
          startedAt: '2022-10-18T06:47:55.741Z',
          status: JOB_STATUS.COMPLETED,
          type: JOB_TYPES.IMPORT,
        }}
      />
    );

    const value6Ref = columns[5].HeaderValue();

    expect(value6Ref).toEqual(
      <HeaderWithHelpText title="Auto-resolved" helpKey="runConsole.resolved" />
    );
    const valuecomRef = columns[5].Value({ rowData: jobdata });

    expect(valuecomRef).toBe(0);
    const value7Ref = columns[6].Value({ rowData: jobdata1 });

    expect(value7Ref).toBe(1);
    const value7Ref1 = columns[6].Value({ rowData: jobdata });

    expect(value7Ref1).toBe(1);

    const value8Ref = columns[7].Value({ rowData: jobdata });

    expect(value8Ref).toBe('00:00:40');

    const value9Ref = columns[8].Value({ rowData: jobdata });

    expect(value9Ref).toEqual(
      <TimeAgo date="2022-10-18T06:48:36.672Z" />
    );
  });
});
