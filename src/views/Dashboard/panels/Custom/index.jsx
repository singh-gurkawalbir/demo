import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
// eslint-disable-next-line import/no-duplicates
import { useSelector } from 'react-redux';
import Content from './components/Content';
import LoadResources from '../../../../components/LoadResources';
import LoadingNotification from '../../../../App/LoadingNotification';

import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { additionalFilter } from '../../../ResourceList/util';

const resourcesToLoad = resourceType => {
  if (resourceType === 'exports' || resourceType === 'imports') {
    // add connections
    return `${resourceType},connections`;
  }
  if (resourceType === 'apis') {
    return `${resourceType},scripts`;
  }

  return resourceType;
};
const spinner = <LoadingNotification message="Loading" />;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  completeFlowTable: {
    minHeight: '300px',
  },
}));

export default function CustomPanel() {
  const resourceType = 'exports';
  const filter = useSelector(state => selectors.filter(state, resourceType));
  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      filter: additionalFilter(resourceType),
      ...(filter || {}),
    }),
    [filter, resourceType]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );

  const connectionList = useSelector(state =>
    selectors.resourceList(state, { type: 'connections' })
  ).resources;
  const flowList = useSelector(state =>
    selectors.resourceList(state, { type: 'flows' })
  ).resources;

  const classes = useStyles();

  return (
    <div className={classes.completeFlowTable}>
      <div className={classes.root}>
        <LoadResources
          required
          resources={resourcesToLoad(resourceType)}
          spinner={spinner}
        >
          <Content
            colsize={2}
            data={{
              imports: list.resources,
              connections: connectionList,
              flows: flowList,
            }}
          />
        </LoadResources>
      </div>
      <p />
    </div>
  );
}
