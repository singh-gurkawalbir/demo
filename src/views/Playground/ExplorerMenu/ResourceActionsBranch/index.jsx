import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../../actions';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import ImportsIcon from '../../../../components/icons/ImportsIcon';
import ExportsIcon from '../../../../components/icons/ExportsIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import ToolsIcon from '../../../../components/icons/ToolsIcon';
import TransformIcon from '../../../../components/icons/TransformIcon';
import OverflowTreeItem from '../OverflowTreeItem';

// whats the best way to get the value?
// Does a fn like this already exist?
function getValueFromPath(o, path) {
  if (typeof o !== 'object') return;
  if (!path || typeof path !== 'string') return;

  const parts = path.split('.');
  let value = o;

  for (let i = 0; i < parts.length; i += 1) {
    value = value[parts[i]];

    if (i < parts.length && typeof value !== 'object') {
      value = undefined;
      break;
    }
  }

  return value;
}

const hideEditor = true;

function getEditorsByResource(resource) {
  if (!resource || hideEditor) return [];

  const { adaptorType } = resource;

  // eslint-disable-next-line no-console
  // console.log('getEditorsByResource: ', resource);

  switch (adaptorType) {
    case 'FTPExport':
      return [
        {type: 'csvParser', fieldId: 'file.csv'},
        {type: 'transform', fieldId: 'transform'},
      ];
    default:
      // eslint-disable-next-line no-console
      console.warn(`getEditorsByResource probably needs to be updated to support ${adaptorType} resources`);

      return [];
  }
}

const EditorIcon = ({type}) => {
  switch (type) {
    case 'csvParser':
      return <ToolsIcon />;
    case 'transform':
      return <TransformIcon />;
    default:
      return <ToolsIcon />;
  }
};

export default function ResourceItemsBranch({onEditorChange, flowId, resourceId}) {
  const history = useHistory();
  const dispatch = useDispatch();

  // The FlowResource selector does not deliver the resourceType
  // Without this, we must query both imports and exports collections
  // to find the flow resource details. If we have a better selector, we
  // should use it.

  const { resource, resourceType } = useSelector(state => {
    if (!resourceId) return {};
    const resource = selectors.resource(state, 'exports', resourceId);

    if (resource) {
      return { resource, resourceType: 'exports' };
    }

    return {
      resource: selectors.resource(state, 'imports', resourceId),
      resourceType: 'imports',
    };
  }, shallowEqual);

  const handleViewResource = (resourceType, resourceId) => {
    history.push(`/playground/edit/${resourceType}/${resourceId}`);
  };

  const handleEditorClick = (type, fieldId) => {
    // eslint-disable-next-line no-console
    // console.log('type, fieldId, flowId, resourceId, resource',
    //   type, fieldId, flowId, resourceId, resource);

    // TODO: @Ashu, what is the correct arg to properly init an editor?
    dispatch(actions._editor.init(fieldId, type, {
      rule: getValueFromPath(resource, fieldId),
      flowId,
      resourceId,
      fieldId,
      // stage?
    }));

    onEditorChange(fieldId);
  };

  const editors = getEditorsByResource(resource);

  const ResourcesIcon = () => resourceType === 'exports'
    ? <ExportsIcon />
    : <ImportsIcon />;

  return (
    <>
      <OverflowTreeItem
        icon={<ResourcesIcon />}
        nodeId={`${resourceId}-view-resource`}
        label={`View ${MODEL_PLURAL_TO_LABEL[resourceType]}`}
        onClick={() => handleViewResource(resourceType, resourceId)} />
      {/* every PG and PP must have a connectionId no null checks required here */}
      {resource._connectionId && (
      <OverflowTreeItem
        icon={<ConnectionsIcon />}
        nodeId={`${resource._connectionId}-view-connection`}
        label="View Connection"
        onClick={() => handleViewResource('connections', resource._connectionId)} />
      )}

      {!!editors?.length && editors.map(({type, fieldId}) => (
        <OverflowTreeItem
          key={type} nodeId={type} label={type}
          icon={<EditorIcon type={type} />}
          onClick={() => handleEditorClick(type, fieldId)} />
      ))}
    </>
  );
}
