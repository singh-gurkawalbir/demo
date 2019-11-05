import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../constants/resource';
import getExistingResourcePagePath from '../../utils/resource';
import OldValue from './OldValue';

export const AUDIT_LOG_SOURCE_LABELS = {
  ui: 'UI',
  api: 'API',
  connector: 'Connector',
  stack: 'Stack',
  system: 'System',
};
export const AUDIT_LOG_EVENT_LABELS = {
  create: 'Create',
  delete: 'Delete',
  update: 'Update',
  view: 'View',
};
export const OPTION_ALL = { id: 'all', label: 'All' };

export const MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK = 300;
export const MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK = 10;

export function showViewDiffLink(oldValue, newValue) {
  const oldValueType = typeof oldValue;
  const newValueType = typeof newValue;
  const oldValueLength =
    oldValue &&
    (oldValueType === 'object'
      ? JSON.stringify(oldValue).length
      : oldValue.length);
  const newValueLength =
    newValue &&
    (newValueType === 'object'
      ? JSON.stringify(newValue).length
      : newValue.length);
  const minimumLengthByType = {
    string: MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK,
    object: MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK,
  };

  if (oldValueLength > minimumLengthByType[oldValueType]) {
    return true;
  }

  if (newValueLength > minimumLengthByType[newValueType]) {
    return true;
  }

  return false;
}

export function getResource(resourceType, resourceId, actionProps) {
  const { resourceDetails } = actionProps;
  const resourceTypePlural = RESOURCE_TYPE_SINGULAR_TO_PLURAL[resourceType];
  const resource =
    resourceType &&
    resourceDetails[resourceTypePlural] &&
    resourceDetails[resourceTypePlural][resourceId];

  return resource;
}

export function getResourceLink(al, actionProps) {
  return (
    <Fragment>
      {al.event === 'delete' && al.deletedInfo && al.deletedInfo.name}
      {al.event !== 'delete' && (
        <Link
          to={getExistingResourcePagePath({
            type: al.resourceType,
            id: al._resourceId,
            _integrationId: (
              getResource(al.resourceType, al._resourceId, actionProps) || {}
            )._integrationId,
          })}>
          {(getResource(al.resourceType, al._resourceId, actionProps) || {})
            .name || `${al._resourceId}`}
        </Link>
      )}
    </Fragment>
  );
}

export function getOldValue(al) {
  return <OldValue auditLog={al} />;
}

export function getNewValue(al) {
  return (
    <Fragment>
      {!showViewDiffLink(al.fieldChange.oldValue, al.fieldChange.newValue) && (
        <Fragment>
          {al.fieldChange && typeof al.fieldChange.newValue === 'string'
            ? al.fieldChange.newValue
            : JSON.stringify(al.fieldChange.newValue)}
        </Fragment>
      )}
    </Fragment>
  );
}
