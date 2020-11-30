/* global describe, test, expect */
import reducer from '.';

const DEFAULT_STATE = {};

describe('Flow sample data reducer ', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = {};
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });

  test('should return default state if the state is undefined', () => {
    const prevState = undefined;
    const currState = reducer(prevState, { type: 'RANDOM_ACTION'});

    expect(currState).toEqual(DEFAULT_STATE);
  });

  describe('FLOW_DATA.INIT action', () => {
    test('should initialize flow state with default props if we pass an invalid flow', () => {

    });
    test('should initialize flow state with passed flow data', () => {

    });
    test('should initialize flow state with passed flow data including refresh prop', () => {

    });
    test('should override the existing flow state if already state is initialized', () => {

    });
  });
  describe('FLOW_DATA.STAGE_REQUEST action', () => {
    test('should retain previous state in case of no flowId/resourceId/stage passed', () => {

    });
    test('should not corrupt existing state if the flowId passed does not exist on the state', () => {

    });
    test('should update stage as request inside pageGeneratorsMap incase of the resource being PG ', () => {

    });
    test('should update stage as request inside pageProcessorsMap incase of the resource being PP ', () => {

    });
  });
  describe('FLOW_DATA.PREVIEW_DATA_RECEIVED action', () => {
    test('should retain previous state in case of no flowId/resourceId/previewType passed', () => {

    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {

    });
    test('should update flowInput stage as received with preview data when passed as previewType ', () => {

    });
    test('should update raw stage as received with preview data when passed as previewType ', () => {

    });
    test('should update raw stage as received with empty preview data when passed ', () => {

    });
  });
  describe('FLOW_DATA.PROCESSOR_DATA_REQUEST action', () => {
    test('should retain previous state in case of no flowId/resourceId/processor passed', () => {

    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow state', () => {

    });
    test('should update stage as request inside pageGeneratorsMap incase of the resource being PG ', () => {

    });
    test('should update stage as request inside pageProcessorsMap incase of the resource being PP ', () => {

    });
  });
  describe('FLOW_DATA.PROCESSOR_DATA_RECEIVED action', () => {
    test('should retain previous state in case of no flowId/resourceId/processor passed', () => {

    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {

    });
    test('should update processor stage as received with processor data  ', () => {

    });
    test('should update processor stage as received with processor data in nested data incase of hooks  ', () => {

    });
    test('should update processor stage as received with processor data empty incase of undefined data  ', () => {

    });
    test('should update stage as received with processor data inside pageGeneratorsMap incase of the resource being PG ', () => {

    });
    test('should update stage as received with processor data inside pageProcessorsMap incase of the resource being PP ', () => {

    });
  });
  describe('FLOW_DATA.RECEIVED_ERROR action', () => {
    test('should retain previous state in case of no flowId/resourceId/stage passed', () => {

    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {

    });
    test('should update processor stage as error with passed error', () => {

    });
    test('should update processor stage inside pageGeneratorsMap as error with passed error incase of the resource being pg', () => {

    });
    test('should update processor stage inside pageProcessorsMap as error with passed error incase of the resource being pg', () => {

    });
  });
  describe('FLOW_DATA.FLOW_RESPONSE_MAPPING_UPDATE action', () => {
    test('should retain previous state in case of no flowId/resourceIndex/responseMapping passed', () => {
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
    });
    test('should not corrupt existing flow state if the passed resourceIndex is invalid', () => {

    });
    test('should update resource at resourceIndex on pageProcessors with new responseMapping passed', () => {

    });
  });
  describe('FLOW_DATA.RESET_STAGES action', () => {
    test('should retain previous state in case of no flowId/resourceId passed', () => {
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
    });
    test('should retain previous state if the passed resourceId is not part of flow state ', () => {

    });
    test('should clear all stages for all resources if no stages are passed ', () => {

    });
    test('should clear all pps following passed resourceId if it is a PP', () => {

    });
    test('should clear all pgs following passed resourceId and also all pps if the resource is a PG', () => {

    });
    test('should clear all resources followed by the passed resourceId and update current resourceId stage with passed stageToUpdate', () => {

    });
  });
  describe('FLOW_DATA.FLOW_SEQUENCE_RESET action', () => {
    test('should retain previous state in case of no flowId passed', () => {
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
    });
    test('should clear all pps followed by first pp out of order in the passed updatedFlow ( when user drags/deletes one of the pps and changes order in the flow builder ) ', () => {

    });
    test('should clear all pgs followed by first pg out of order in the passed updatedFlow and also all pps are clear ( when user drags/deletes one of the pgs and changes order in the flow builder) ', () => {

    });
    test('should not clear existing stages of any resource if the updatedFlow does not change order of any pgs/pps ( when user adds new PG/PP at the end ) ', () => {
      // should it not clear pp stages if user adds a new PG ?  currently it clears pps )
    });
  });
});

describe('getFlowDataState selector', () => {
  test('should return undefined when the state/flowId is invalid ', () => {

  });
  test('should return entire flow state if there is no resourceId passed', () => {

  });
  test('should return resource related stages data in the state if the resourceId passed is PG', () => {

  });
  test('should return resource related stages data in the state if the resourceId passed is PP', () => {

  });
});
describe('getSampleDataContext selector', () => {
  test('should return default value incase of no resourceId/flowId/state', () => {

  });
  test('should return default value incase of invalid stage passed', () => {

  });
  test('should return default value if the passed resourceId does not exist or passed stage does not exist', () => {

  });
  test('should return resource sub state for the passed resourceId and with matched stage data', () => {

  });
});
