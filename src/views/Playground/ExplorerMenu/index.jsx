import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { TreeView, TreeItem} from '@material-ui/lab';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import LoadResources from '../../../components/LoadResources';
import getEditorsByResource from './util';
import IntegrationIcon from '../../../components/icons/IntegrationAppsIcon';
import FlowIcon from '../../../components/icons/FlowsIcon';
import ResourcesIcon from '../../../components/icons/ResourcesIcon';
import ToolsIcon from '../../../components/icons/ToolsIcon';
import TransformIcon from '../../../components/icons/TransformIcon';

const useStyles = makeStyles(theme => ({
  editorItem: {
    paddingTop: theme.spacing(1),
    '& > div > p': {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
}));

export default function ExplorerMenu({ onClick }) {
  const classes = useStyles();
  const [integrationId, setIntegrationId] = useState();
  const [flowId, setFlowId] = useState();
  const [resourceId, setResourceId] = useState();

  const integrations = useSelector(state =>
    selectors.resources(state, 'integrations')
      .map(i => ({ id: i._id, name: i.name })), shallowEqual);

  const flows = useSelector(state => {
    if (!integrationId) return;

    return selectors.resources(state, 'flows')
      .filter(f => f._integrationId === integrationId)
      .map(f => ({ id: f._id, name: f.name }));
  }, shallowEqual);

  const flowResources = useSelectorMemo(selectors.mkFlowResources, flowId);

  // The above FlowResource selector does not deliver the resourceType
  // Without this, we must query both imports and exports collections
  // to find the flow resource details. If we have a better selector, we
  // should use it.
  const resource = useSelector(state => {
    if (!resourceId) return;
    const resource = selectors.resource(state, 'exports', resourceId);

    if (resource) return resource;

    return selectors.resource(state, 'imports', resourceId);
  });

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

  const ResourceItemsBranch = ({id}) => {
    if (id !== resourceId) return null;

    const editors = getEditorsByResource(resource);

    if (!editors?.length) {
      return <TreeItem nodeId={`${id}-empty`} label="Add this resource type to getEditorsByResource" />;
    }

    return editors.map(({type, fieldId}) => (
      <TreeItem
        key={type} nodeId={type} label={type}
        icon={<EditorIcon type={type} />}
        // onClick(flowId, resourceId, stage, fieldId)
        // We need to enhance the getEditorsByResource response to provide the correct
        // data points that are needed to init an editor. Possibly the above onClick
        // callback sent from the playground view needs to be fixed too.
        onClick={() => onClick(flowId, resourceId, type, fieldId)} />
    ));
  };

  const ResourcesBranch = ({id}) => {
    if (id !== flowId) return null;

    if (!flowResources?.length) {
      return <TreeItem nodeId={`${id}-empty`} label="No Resources" />;
    }

    return flowResources.map(({_id: id, name}) => (
      <TreeItem
        key={id} nodeId={id} label={name || id}
        icon={<ResourcesIcon />}
        onClick={() => setResourceId(id)} >
        <ResourceItemsBranch id={id} />
      </TreeItem>
    ));
  };

  const FlowBranch = ({id}) => {
    if (id !== integrationId) return null;

    if (!flows.length) {
      return <TreeItem nodeId={`${id}-empty`} label="No Flows" />;
    }

    return flows.map(({id, name}) => (
      <TreeItem
        key={id} nodeId={id} label={name || id}
        icon={<FlowIcon />}
        onClick={() => setFlowId(id)}>
        <ResourcesBranch id={id} />
      </TreeItem>
    ));
  };

  const expanded = [];

  if (integrationId) expanded.push(integrationId);
  if (flowId) expanded.push(flowId);
  if (resourceId) expanded.push(resourceId);

  return (
    <LoadResources resources="integrations,flows,imports,exports">
      <TreeView
        defaultCollapseIcon={<ArrowUpIcon />}
        defaultExpandIcon={<ArrowDownIcon />}
        expanded={expanded}
      >
        {integrations.map(({id, name}) => (
          <TreeItem
            icon={<IntegrationIcon />}
            className={classes.editorItem}
            key={id} nodeId={id} label={name}
            onClick={() => setIntegrationId(id)}>
            <FlowBranch id={id} />
          </TreeItem>
        ))}
      </TreeView>
    </LoadResources>
  );
}
