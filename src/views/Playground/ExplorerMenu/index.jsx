import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { TreeView} from '@mui/lab';
import { Typography } from '@mui/material';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import LoadResources from '../../../components/LoadResources';
import IntegrationIcon from '../../../components/icons/IntegrationAppsIcon';
import FlowIcon from '../../../components/icons/FlowsIcon';
import ImportsIcon from '../../../components/icons/ImportsIcon';
import ExportsIcon from '../../../components/icons/ExportsIcon';
import FlowBuilderIcon from '../../../components/icons/FlowBuilderIcon';
import ResourceActionsBranch from './ResourceActionsBranch';
import OverflowTreeItem from './OverflowTreeItem';
import CeligoTruncate from '../../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  editorItem: {
    paddingTop: theme.spacing(1),
    '& > div > p': {
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& .MuiTreeItem-content': {
      paddingLeft: 0,
    },
  },
}));

const emptyArray = [];

export default function ExplorerMenu({ onEditorChange }) {
  const classes = useStyles();
  const history = useHistory();
  const [integrationId, setIntegrationId] = useState();
  const [flowId, setFlowId] = useState();
  const [resourceId, setResourceId] = useState();

  const integrations = useSelector(state =>
    selectors.resources(state, 'integrations'))
    .map(i => ({ id: i._id, name: i.name }));

  const flows = useSelector(state => {
    if (!integrationId) return emptyArray;

    return selectors.resources(state, 'flows');
  })
    .filter(f => f._integrationId === integrationId)
    .map(f => ({ id: f._id, name: f.name }));

  const allFlowResources = useSelectorMemo(selectors.mkFlowResources, flowId);
  // exclude flow-level resource...Open in Flow Builder takes care of opening the flow through the FB
  // only show PGs and PPs
  const flowResources = useMemo(() => allFlowResources.filter(e => e.name !== 'Flow-level'), [allFlowResources]);

  const ResourcesBranch = ({id}) => {
    if (id !== flowId) return null;

    const handleFbClick = () => {
      history.push(`/integrations/${integrationId}/flowBuilder/${flowId}`);
    };

    const ResourceIcon = ({resourceType}) =>
      resourceType === 'exports' ? <ExportsIcon /> : <ImportsIcon />;

    return (
      <>
        <OverflowTreeItem
          icon={<FlowBuilderIcon />}
          nodeId={`${resourceId}-fb`}
          label="Open in Flow Builder"
          onClick={handleFbClick} />

        {flowResources.map(({_id: id, name, type}) => (
          <OverflowTreeItem
            key={id} nodeId={id} label={name || id}
            icon={<ResourceIcon resourceType={type} />}
            onClick={() => setResourceId(id)} >
            {(id === resourceId) && (
            <ResourceActionsBranch
              flowId={flowId}
              resourceId={resourceId}
              onEditorChange={onEditorChange}
            />
            )}
          </OverflowTreeItem>
        ))}
      </>
    );
  };

  const FlowBranch = ({id}) => {
    if (id !== integrationId) return null;

    if (!flows.length) {
      return <OverflowTreeItem nodeId={`${id}-empty`} label="No flows" />;
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
    <LoadResources required resources="integrations,connections,flows,imports,exports">
      <TreeView
        defaultCollapseIcon={<ArrowUpIcon />}
        defaultExpandIcon={<ArrowDownIcon />}
        expanded={expanded}
      >
        {integrations.map(({id, name}) => (
          <OverflowTreeItem
            icon={<IntegrationIcon />}
            className={classes.editorItem}
            key={id} nodeId={id}
            label={<Typography variant="body1"><CeligoTruncate lines={1}>{name}</CeligoTruncate></Typography>}
            onClick={() => setIntegrationId(id)}>
            <FlowBranch id={id} />
          </OverflowTreeItem>
        ))}
      </TreeView>
    </LoadResources>
  );
}
