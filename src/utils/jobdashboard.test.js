
import { getStatus, JOB_UI_STATUS, getSuccess } from './jobdashboard';

describe('Job dashboard utils test cases', () => {
  describe('getStaus util', () => {
    test('should get correct job status', () => {
      expect(getStatus({_id: 'job1', type: 'flow', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'completed' })).toEqual(JOB_UI_STATUS.completed);
      expect(getStatus({_id: 'job1', type: 'flow', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running' })).toEqual(JOB_UI_STATUS.running);
      expect(getStatus({_id: 'job1', type: 'flow', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true })).toEqual(JOB_UI_STATUS.running);
      expect(getStatus({_id: 'job1', type: 'flow', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true, percentComplete: 100 })).toEqual(JOB_UI_STATUS.COMPLETING);
      expect(getStatus({_id: 'job1', type: 'flow', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true, percentComplete: 90 })).toBe(`${JOB_UI_STATUS.running} 90 %`);

      expect(getStatus({_id: 'job1', type: 'export', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'completed' })).toEqual(JOB_UI_STATUS.completed);
      expect(getStatus({_id: 'job1', type: 'export', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running' })).toEqual(JOB_UI_STATUS.running);
      expect(getStatus({_id: 'job1', type: 'export', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true })).toEqual(JOB_UI_STATUS.running);

      expect(getStatus({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'completed' })).toEqual(JOB_UI_STATUS.completed);
      expect(getStatus({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running' })).toEqual(JOB_UI_STATUS.running);
      expect(getStatus({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true })).toEqual(JOB_UI_STATUS.running);
      expect(getStatus({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true, percentComplete: 100 })).toEqual(JOB_UI_STATUS.COMPLETING);
      expect(getStatus({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', doneExporting: true, percentComplete: 90 })).toBe(`${JOB_UI_STATUS.running} 90 %`);
    });
  });
  describe('getSuccess util', () => {
    test('should get number of success values', () => {
      expect(getSuccess({_id: 'job1', type: 'export', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'completed', numSuccess: 0 })).toBe('N/A');
      expect(getSuccess({_id: 'job1', type: 'export', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'running', numSuccess: 1 })).toBe(1);

      expect(getSuccess({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'completed' })).toBeUndefined();
      expect(getSuccess({_id: 'job1', type: 'import', _exportId: 'exp1', _flowId: 'flow1', uiStatus: 'completed', numSuccess: 1 })).toBe(1);
    });
  });
});
