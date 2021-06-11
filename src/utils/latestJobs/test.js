/* global describe, test, expect */
import { JOB_STATUS } from '../constants';
import {
  getFlowStepsYetToBeCreated,
  generatePendingFlowSteps,
  getRunConsoleJobSteps,
  getParentJobSteps,
  FLOW_STEP_STATUS,
} from '.';

describe('latestJobs utils test cases', () => {
  describe('getFlowStepsYetToBeCreated util test cases', () => {
    test('should return empty list incase of empty/invalid flow', () => {
      expect(getFlowStepsYetToBeCreated()).toEqual([]);
      expect(getFlowStepsYetToBeCreated(null)).toEqual([]);
      expect(getFlowStepsYetToBeCreated({})).toEqual([]);
    });
    test('should return empty list if the pps are not valid ', () => {
      const flow = {
        pageProcessors: [
          { _exportId: 'id1', type: 'invalid'},
          { _exportId: 'id2', type: 'invalid'},
        ],
      };
      const createdSteps = [
        { _exportId: 'id1', type: 'export'},
        { _exportId: 'id2', type: 'export'},
      ];

      expect(getFlowStepsYetToBeCreated(flow, createdSteps)).toEqual([]);
    });
    test('should return all the pageprocessors if there are no created steps yet', () => {
      const flow = {
        pageProcessors: [
          { _exportId: 'id1', type: 'export'},
          { _exportId: 'id2', type: 'export'},
          { _exportId: 'id3', type: 'export'},
          { _importId: 'id4', type: 'import'},
        ],
      };

      expect(getFlowStepsYetToBeCreated(flow)).toEqual(flow.pageProcessors);
    });
    test('should return all the pending pageprocessors which are not part of created steps passed', () => {
      const flow = {
        pageProcessors: [
          { _exportId: 'id1', type: 'export'},
          { _exportId: 'id2', type: 'export'},
          { _exportId: 'id3', type: 'export'},
          { _importId: 'id4', type: 'import'},
        ],
      };
      const createdSteps = [
        { _exportId: 'id1', type: 'export'},
        { _exportId: 'id2', type: 'export'},
      ];
      const expectedPendingSteps = [
        { _exportId: 'id3', type: 'export'},
        { _importId: 'id4', type: 'import'},
      ];

      expect(getFlowStepsYetToBeCreated(flow, createdSteps)).toEqual(expectedPendingSteps);
    });
  });
  describe('generatePendingFlowSteps util test cases', () => {
    test('should return empty list if there are no pps passed', () => {
      expect(generatePendingFlowSteps()).toEqual([]);
    });
    test('should return pending steps with required uiStatus for the pp exports and imports passed', () => {
      const pageProcessors = [
        { _exportId: 'id1', type: 'export'},
        { _exportId: 'id2', type: 'export'},
        { _exportId: 'id3', type: 'export'},
        { _importId: 'id4', type: 'import'},
      ];
      const resourceMap = {
        exports: {
          id1: { name: 'Export1'},
          id2: { name: 'Export2'},
          id3: { name: 'Export3'},
          id4: { name: 'Export4'},
        },
        imports: {
          id4: { name: 'Import1'},
        },
      };
      const expectedPendingFlowSteps = [
        { type: 'export', uiStatus: FLOW_STEP_STATUS.WAITING, name: 'Export1' },
        { type: 'export', uiStatus: FLOW_STEP_STATUS.WAITING, name: 'Export2' },
        { type: 'export', uiStatus: FLOW_STEP_STATUS.WAITING, name: 'Export3' },
        { type: 'import', uiStatus: FLOW_STEP_STATUS.WAITING, name: 'Import1' },
      ];

      expect(generatePendingFlowSteps(pageProcessors, resourceMap)).toEqual(expectedPendingFlowSteps);
    });
    test('should return pending steps with undefined name incase the resource is not part of resourceMap', () => {
      const pageProcessors = [
        { _exportId: 'id1', type: 'export'},
        { _exportId: 'id2', type: 'export'},
        { _importId: 'id4', type: 'import'},
      ];
      const resourceMap = {
        exports: {
          id1: { name: 'Export1'},
        },
        imports: {
          id4: { name: 'Import1'},
        },
      };
      const expectedPendingFlowSteps = [
        { type: 'export', uiStatus: FLOW_STEP_STATUS.WAITING, name: 'Export1' },
        { type: 'export', uiStatus: FLOW_STEP_STATUS.WAITING, name: undefined },
        { type: 'import', uiStatus: FLOW_STEP_STATUS.WAITING, name: 'Import1' },
      ];

      expect(generatePendingFlowSteps(pageProcessors, resourceMap)).toEqual(expectedPendingFlowSteps);
    });
  });
  describe('getRunConsoleJobSteps util test cases', () => {
    const resourceMap = {
      exports: {
        id1: { name: 'Export1'},
        id2: { name: 'Export2'},
        id3: { name: 'Export3'},
        id4: { name: 'Export4'},
      },
      imports: {
        id4: { name: 'Import1'},
      },
    };

    test('should return empty list incase of invalid params or with no childJobs', () => {
      expect(getRunConsoleJobSteps()).toEqual([]);
      const parentJob = { _id: 'job1', type: 'flow'};
      const childJobs = [];

      expect(getRunConsoleJobSteps(parentJob, childJobs, resourceMap)).toEqual([]);
    });
    test('should return job steps with required props when childJobs are passed', () => {
      const parentJob = { _id: 'job1', type: 'flow', status: JOB_STATUS.RUNNING};
      const childJobs = [
        { _id: 'cj1', _exportId: 'id1', status: JOB_STATUS.COMPLETED, type: 'export' },
        { _id: 'cj2', _exportId: 'id2', status: JOB_STATUS.RUNNING, type: 'export' },
      ];
      const expectedJobSteps = [
        {...childJobs[0], uiStatus: JOB_STATUS.COMPLETED, duration: undefined, name: 'Export1' },
        {...childJobs[1], uiStatus: JOB_STATUS.RUNNING, duration: undefined, name: 'Export2' },
      ];

      expect(getRunConsoleJobSteps(parentJob, childJobs, resourceMap)).toEqual(expectedJobSteps);
    });
    test('should return jobs steps with percentComplete property for import childJobs', () => {
      const parentJob = { _id: 'job1', type: 'flow', status: JOB_STATUS.RUNNING, numPagesGenerated: 100, doneExporting: true};
      const childJobs = [
        { _id: 'cj1', _exportId: 'id1', status: JOB_STATUS.COMPLETED, type: 'export' },
        { _id: 'cj2', _importId: 'id4', status: JOB_STATUS.RUNNING, numPagesProcessed: 10, type: 'import' },
      ];
      const expectedJobSteps = [
        {...childJobs[0], uiStatus: JOB_STATUS.COMPLETED, duration: undefined, name: 'Export1' },
        {...childJobs[1], uiStatus: JOB_STATUS.RUNNING, duration: undefined, name: 'Import1', percentComplete: 10 },
      ];

      expect(getRunConsoleJobSteps(parentJob, childJobs, resourceMap)).toEqual(expectedJobSteps);
    });
    test('should return job steps  with cancelling status if the parent job is cancelled and child job is still in progress', () => {
      const parentJob = { _id: 'job1', type: 'flow', status: JOB_STATUS.CANCELED};
      const childJobs = [
        { _id: 'cj1', _exportId: 'id1', status: JOB_STATUS.COMPLETED, type: 'export' },
        { _id: 'cj2', _exportId: 'id2', status: JOB_STATUS.RUNNING, type: 'export' },
      ];
      const expectedJobSteps = [
        {...childJobs[0], uiStatus: JOB_STATUS.COMPLETED, duration: undefined, name: 'Export1' },
        {...childJobs[1], uiStatus: FLOW_STEP_STATUS.CANCELLING, duration: undefined, name: 'Export2' },
      ];

      expect(getRunConsoleJobSteps(parentJob, childJobs, resourceMap)).toEqual(expectedJobSteps);
    });
  });
  describe('getParentJobSteps util test cases', () => {
    test('should return empty list if the parentJob is invalid or empty', () => {
      expect(getParentJobSteps()).toEqual([]);
      expect(getParentJobSteps({})).toEqual([]);
      expect(getParentJobSteps(null)).toEqual([]);
    });
    test('should return empty list if the parentJob has valid running child jobs to show', () => {
      const runningParentJobWithChildJobs = {
        status: JOB_STATUS.RUNNING,
        children: [
          { _id: 'id1', status: JOB_STATUS.RUNNING, type: 'export'},
        ],
        type: 'flow',
        name: 'FLOW1',
      };
      const cancelledParentJobWithChildJobs = {
        status: JOB_STATUS.CANCELED,
        children: [
          { _id: 'id1', status: JOB_STATUS.CANCELED, type: 'export'},
        ],
        type: 'flow',
        name: 'FLOW2',
      };

      expect(getParentJobSteps(runningParentJobWithChildJobs)).toEqual([]);
      expect(getParentJobSteps(cancelledParentJobWithChildJobs)).toEqual([]);
    });
    test('should return a parent job step if the parentJob is in queued status', () => {
      const parentJob = { status: JOB_STATUS.QUEUED, _id: 'id1', type: 'flow', name: 'FLOW1' };
      const expectedParentJobSteps = [{ ...parentJob, uiStatus: JOB_STATUS.QUEUED }];

      expect(getParentJobSteps(parentJob)).toEqual(expectedParentJobSteps);
    });
    test('should return a parent job step if the parentJob is in progress but no child jobs are created yet', () => {
      const parentJob = { status: JOB_STATUS.RUNNING, _id: 'id1', type: 'flow', name: 'FLOW1' };
      const expectedParentJobSteps = [{ ...parentJob, uiStatus: JOB_STATUS.RUNNING }];

      expect(getParentJobSteps(parentJob)).toEqual(expectedParentJobSteps);
    });
    test('should return a parent job step if the parentJob is cancelled with no child jobs created', () => {
      const parentJob = { status: JOB_STATUS.CANCELED, _id: 'id1', type: 'flow', name: 'FLOW1', children: [] };
      const expectedParentJobSteps = [{ ...parentJob, uiStatus: JOB_STATUS.CANCELED }];

      expect(getParentJobSteps(parentJob)).toEqual(expectedParentJobSteps);
    });
  });
});
