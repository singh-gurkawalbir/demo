import produce from 'immer';
import { isEqual, uniqBy } from 'lodash';
import actionTypes from '../../../../actions/types';
import { convertOldFlowSchemaToNewOne, populateRestSchema } from '../../../../utils/flows';
import { resourceWithoutUIFields } from '../../../../utils/resource';
import { getHttpConnector } from '../../../../constants/applications';

export const initializationResources = ['profile', 'preferences'];
const accountResources = ['ashares', 'shared/ashares', 'licenses'];
const resourceTypesToIgnore = [
  ...initializationResources,
  ...accountResources,
  'audit',
];
const updateStateWhenValueDiff = (state, key, value) => {
  if (isEqual(state[key], value)) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  state[key] = value;
};

function replaceOrInsertResource(draft, resourceType, resourceValue) {
  // handle case of no collection
  let type = resourceType;
  // RESOURCE_RECEIVED is being called with null on some GET resource calls when api doesnt return anything.
  let resource = resourceValue || {};

  if (type.includes('/licenses')) {
    const id = type.substring('connectors/'.length, type.indexOf('/licenses'));

    resource._connectorId = id;
    type = 'connectorLicenses';
  }

  // For accesstokens and connections within an integration
  if (type.includes('integrations/')) {
    type = type.split('/').pop();
  }

  if (type === 'flows') resource = convertOldFlowSchemaToNewOne(resource);
  if (type === 'exports') resource = populateRestSchema(resource);

  if (type === 'imports' || type === 'exports') {
    const connection = draft.connections?.find(conn => conn._id === resource._connectionId);

    if (getHttpConnector(connection?.http?._httpConnectorId)?._id && resource.adaptorType?.includes('REST')) {
      resource = {...resource, adaptorType: 'HTTPExport', restToHTTPConverted: true};

      delete resource.rest;
    }
    if (connection?.type === 'van' && resource.adaptorType?.includes('AS2')) {
      return {...resource, adaptorType: resourceType === 'exports' ? 'VANExport' : 'VANImport'};
    }
    // remove UI heavy fields from the resource
    resource = resourceWithoutUIFields(resource);
  }
  if (!draft[type]) {
    draft[type] = [resource];

    return;
  }
  // if we have a collection, look for a match
  const collection = draft[type];
  const index = collection.findIndex(r => r._id === resource._id);

  // insert if not found, replace if found...
  if (index === -1) {
    draft[type].push(resource);

    return;
  }

  // no need to make an update when it is the same resource...this helps in saving some render cycles
  if (isEqual(resource, collection[index])) {
    return;
  }

  collection.splice(index, 1, resource);
}

const addResourceCollection = (draft, resourceType, collection) => {
  if (resourceType.includes('/installBase')) {
    const id = resourceType.substring(
      'connectors/'.length,
      resourceType.indexOf('/installBase')
    );

    // IO-16602, We shouldn't show child integrations in the install base for IAF 2.0 as
    // we can not push update to child integrations. Can identify them by _parentId prop
    const filteredCollection = collection?.filter(c => !c._parentId);

    const newCollection =
        filteredCollection?.map(c => ({ ...c, _connectorId: id }));

    updateStateWhenValueDiff(draft, 'connectorInstallBase', newCollection || []);

    return;
  }

  if (resourceType.includes('/licenses')) {
    const id = resourceType.substring(
      'connectors/'.length,
      resourceType.indexOf('/licenses')
    );
    const newCollection = collection?.map(c => ({
      ...c,
      _connectorId: id,
    }));

    updateStateWhenValueDiff(draft, 'connectorLicenses', newCollection || []);

    return;
  }

  if (resourceType === 'recycleBinTTL' && collection && collection.length) {
    const updatedRecycleBinTTL = collection.map(i => ({...i, key: i.doc._id}));

    updateStateWhenValueDiff(draft, 'recycleBinTTL', updatedRecycleBinTTL);

    return;
  }

  if (resourceType === 'flows') {
    const newCollection = collection?.map?.(convertOldFlowSchemaToNewOne);

    updateStateWhenValueDiff(draft, 'flows', newCollection || []);

    return;
  }

  // we need to convert http subdoc to rest subdoc for REST exports.
  // Once rest is deprecated in backend, UI still needs to support REST forms and REST export form needs rest subdoc
  if (resourceType === 'exports' || resourceType === 'imports') {
    let newCollection = collection;

    try {
      if (resourceType === 'exports') {
        newCollection = collection?.map?.(populateRestSchema);
      }
      newCollection = (newCollection || [])?.map(coll => {
        const connection = draft.connections?.find(conn => conn._id === coll._connectionId);

        if (getHttpConnector(connection?.http?._httpConnectorId)?._id && coll.adaptorType?.includes('REST')) {
          const newColl = {...coll, adaptorType: resourceType === 'exports' ? 'HTTPExport' : 'HTTPImport', restToHTTPConverted: true};

          delete newColl.rest;

          return newColl;
        }
        if (connection?.type === 'van' && coll.adaptorType?.includes('AS2')) {
          return {...coll, adaptorType: resourceType === 'exports' ? 'VANExport' : 'VANImport'};
        }

        return coll;
      });
    // eslint-disable-next-line no-empty
    } catch (e) {
    }

    updateStateWhenValueDiff(draft, resourceType, newCollection || []);

    return;
  }
  updateStateWhenValueDiff(draft, resourceType, collection || []);
};

const mergeResourceCollection = (draft, resourceType, response) => {
  let newCollection;

  if (draft[resourceType]) {
    newCollection = uniqBy([...(response || []), ...draft[resourceType]], '_id');
  } else {
    newCollection = response;
  }
  addResourceCollection(draft, resourceType, newCollection);
};

export default (state = {}, action) => {
  const {
    id,
    type,
    resource,
    collection,
    resourceType,
    integrationId,

  } = action;

  // Some resources are managed by custom reducers.
  // Lets skip those for this generic implementation
  if (resourceTypesToIgnore.find(t => t === resourceType)) {
    return state;
  }

  // skip integrations/:_integrationId/ashares
  // skip integrations/:_integrationId/audit
  if (
    resourceType &&
      resourceType.startsWith('integrations/') &&
      (resourceType.endsWith('/ashares') || resourceType.endsWith('/audit') || resourceType.endsWith('/revisions'))
  ) {
    return state;
  }

  // skip all SuiteScript unification resources
  if (resourceType && resourceType.startsWith('suitescript/connections/')) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_COLLECTION:
        if (integrationId) {
          mergeResourceCollection(draft, resourceType, collection);

          return;
        }

        return addResourceCollection(draft, resourceType, collection);
      case actionTypes.RESOURCE.RECEIVED:
        return replaceOrInsertResource(draft, resourceType, resource);
      case actionTypes.RESOURCE.DELETED:
        if (resourceType.includes('/licenses')) {
          const connectorId = resourceType.substring(
            'connectors/'.length,
            resourceType.indexOf('/licenses')
          );

          draft.connectorLicenses = draft.connectorLicenses.filter(
            l => l._id !== id || l._connectorId !== connectorId
          );

          return;
        }
        draft[resourceType] = draft[resourceType].filter(r => r._id !== id);

        return;

      case actionTypes.RESOURCE.CLEAR_COLLECTION:

        draft[resourceType] = [];

        return;
      default:
        return draft;
    }
  });
};

