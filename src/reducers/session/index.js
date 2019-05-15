import { combineReducers } from 'redux';
import stage, * as fromStage from './stage';
import filters, * as fromFilters from './filters';
import editors, * as fromEditors from './editors';
import metadata, * as fromMetadata from './metadata';

export default combineReducers({
  filters,
  editors,
  stage,
  metadata,
});

// #region PUBLIC SELECTORS
export function filter(state, name) {
  if (!state) return {};

  return fromFilters.filter(state.filters, name);
}

export function editor(state, id) {
  if (!state) return {};

  return fromEditors.editor(state.editors, id);
}

export function processorRequestOptions(state, id) {
  if (!state) return {};

  return fromEditors.processorRequestOptions(state.editors, id);
}

export function stagedResource(state, id) {
  if (!state) return {};

  return fromStage.stagedResource(state.stage, id);
}

export function metadataResource(
  state,
  connectionId,
  applicationType,
  resourceType,
  netsuiteSpecificResource
) {
  return fromMetadata.metadataCollection(
    (state && state.metadata) || null,
    connectionId,
    applicationType,
    resourceType,
    netsuiteSpecificResource
  );
}

export function generateOptionsFromMeta(
  state,
  connectionId,
  applicationType,
  resourceType,
  netsuiteSpecificResource
) {
  let options = null;

  if (applicationType === 'netsuite') {
    const data =
      metadataResource(
        state,
        connectionId,
        applicationType,
        resourceType,
        netsuiteSpecificResource
      ) || [];

    if (netsuiteSpecificResource === 'webservices') {
      if (resourceType === 'recordTypes') {
        // {"internalId":"Account","label":"Account"}
        options = data.map(item => ({ label: item.label, value: item.label }));
      } else if (resourceType === 'savedSearches') {
        // {internalId: "794", name: "New Account Search",
        // scriptId: "customsearch794"}
        options = data.map(item => ({
          label: item.name,
          value: item.scriptId,
        }));
      }
    } else if (netsuiteSpecificResource === 'suitescript') {
      if (resourceType === 'recordTypes') {
        // {id: "account",name: "Account",
        // permissionId: "LIST_ACCOUNT",scriptId: "account",
        // scriptable: true,url: "/app/accounting/account/account.nl",
        // userPermission: "4"}
        options = data.map(item => ({ label: item.name, value: item.id }));
      } else if (resourceType === 'savedSearches') {
        // {id: "2615", name: "1mb data"}
        options = data.map(item => ({ label: item.name, value: item.id }));
      }
    }
  } else if (applicationType === 'salesforce') {
    // have to implement this
  }

  return options;
}
// #endregion
