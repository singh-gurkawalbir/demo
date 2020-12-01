import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { TreeView} from '@material-ui/lab';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import LoadResources from '../../../components/LoadResources';
import IntegrationIcon from '../../../components/icons/IntegrationAppsIcon';
import FlowIcon from '../../../components/icons/FlowsIcon';
import ResourcesIcon from '../../../components/icons/ResourcesIcon';
import ResourceItemsBranch from './ResourceActionsBranch';
import OverflowTreeItem from './OverflowTreeItem';

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

  const ResourcesBranch = ({id}) => {
    if (id !== flowId) return null;

    if (!flowResources?.length) {
      return <OverflowTreeItem nodeId={`${id}-empty`} label="No Resources" />;
    }

    // onClick(flowId, resourceId, stage, fieldId)
    // We need to enhance the getEditorsByResource response to provide the correct
    // data points that are needed to init an editor. Possibly the above onClick
    // callback sent from the playground view needs to be fixed too.
    const handleClick = (type, fieldId) => onClick(flowId, resourceId, type, fieldId);

    return flowResources.map(({_id: id, name}) => (
      <OverflowTreeItem
        key={id} nodeId={id} label={name || id}
        icon={<ResourcesIcon />}
        onClick={() => setResourceId(id)} >
        {(id === resourceId) &&
          <ResourceItemsBranch resourceId={resourceId} onClick={handleClick} />}
      </OverflowTreeItem>
    ));
  };

  const FlowBranch = ({id}) => {
    if (id !== integrationId) return null;

    if (!flows.length) {
      return <OverflowTreeItem nodeId={`${id}-empty`} label="No Flows" />;
    }

    return flows.map(({id, name}) => (
      <OverflowTreeItem
        key={id} nodeId={id} label={name || id}
        icon={<FlowIcon />}
        onClick={() => setFlowId(id)}>
        <ResourcesBranch id={id} />
      </OverflowTreeItem>
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
          <OverflowTreeItem
            icon={<IntegrationIcon />}
            className={classes.editorItem}
            key={id} nodeId={id} label={name}
            onClick={() => setIntegrationId(id)}>
            <FlowBranch id={id} />
          </OverflowTreeItem>
        ))}
      </TreeView>
    </LoadResources>
  );
}
