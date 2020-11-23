import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { selectors } from '../../../../reducers';
import ImportsIcon from '../../../../components/icons/ImportsIcon';
import ExportsIcon from '../../../../components/icons/ExportsIcon';
import ToolsIcon from '../../../../components/icons/ToolsIcon';
import TransformIcon from '../../../../components/icons/TransformIcon';
import OverflowTreeItem from '../OverflowTreeItem';

function getEditorsByResource(resource) {
  if (!resource) return [];

  const { adaptorType } = resource;

  // eslint-disable-next-line no-console
  console.log('getEditorsByResource: ', resource);

  switch (adaptorType) {
    case 'FTPExport':
      return [
        {type: 'csvParser', fieldId: '??'},
        {type: 'transform', fieldId: '??'},
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

export default function ResourceItemsBranch({onClick, resourceId}) {
  const history = useHistory();
  // The above FlowResource selector does not deliver the resourceType
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

  const handleViewClick = () => {
    history.push(`/playground/edit/${resourceType}/${resourceId}`);
  };
  const editors = getEditorsByResource(resource);

  const ResourcesIcon = () => resourceType === 'exports'
    ? <ExportsIcon />
    : <ImportsIcon />;

  return (
    <>
      <OverflowTreeItem
        icon={<ResourcesIcon />}
        nodeId={`${resourceId}-view`}
        label="View resource"
        onClick={handleViewClick} />

      {!!editors?.length && editors.map(({type, fieldId}) => (
        <OverflowTreeItem
          key={type} nodeId={type} label={type}
          icon={<EditorIcon type={type} />}
          onClick={() => onClick(type, fieldId)} />
      ))}
    </>
  );
}
