import actionTypes from '../../../actions/types';

// List of stages data gets transformed
const dataStages = {
  raw: 'raw',
  parse: 'parse',
  sample: 'sample',
  transform: 'transform',
  filter: 'filter',
};

/*
 * Generates a stage map with 'stage' as key and value being its associated data
 */
function generateStages(data) {
  const stagesList = data.stages || [];
  const stageMap = {};

  stagesList.forEach(stageData => {
    stageMap[dataStages[stageData.name]] = [stageData];
  });

  return stageMap;
}

/*
 * Returns updated stage related data
 */
function getUpdatedStage(stageData, newData, index) {
  if (!index || index === 0) return [...stageData, newData];

  // If that transform is not present... push it to existing transforms
  if (!stageData[index]) return [...stageData, newData];

  // If it is nth Tranform , Replace nth transform with this data
  return [...stageData.slice(0, index), newData, ...stageData.slice(index + 1)];
}

export default (state = {}, action) => {
  const { type, data, resourceId, stage, index } = action;
  const newState = { ...state };

  switch (type) {
    // Adds data and stages against the resource
    case actionTypes.SAMPLEDATA.RECEIVED: {
      const resourceData = { ...state[resourceId] };

      resourceData.data = data.data;
      resourceData.stages = generateStages(data);

      return { ...newState, [resourceId]: resourceData };
    }

    // Updates a specific stage in the sample data state for the resource
    case actionTypes.SAMPLEDATA.UPDATE_STAGE: {
      const resource = { ...state[resourceId] };
      const currentStage = dataStages[stage];

      resource.stages = { ...resource.stages };
      resource.stages[currentStage] = getUpdatedStage(
        [...(resource.stages[currentStage] || [])],
        data,
        index
      );

      return { ...newState, [resourceId]: resource };
    }

    default:
      return state;
  }
};

export function fetchData(state, resourceId, stage) {
  switch (stage) {
    // Decide what must be the sampleData based on the stages available
    case dataStages.sample: {
      if (!state[resourceId]) return undefined;
      const stages = { ...state[resourceId].stages };

      if (stages.transform && stages.transform.length) {
        return stages.transform.slice(-1)[0].data || [];
      }

      return state[resourceId].data;
    }

    // Returns raw form of the sample data
    case dataStages.raw: {
      return state[resourceId] && state[resourceId].data;
    }

    // Based on index give the previous transform's final data
    case dataStages.transform: {
      return state[resourceId] && state[resourceId].data;
    }

    default:
      return state[resourceId] && state[resourceId].data;
  }
}
