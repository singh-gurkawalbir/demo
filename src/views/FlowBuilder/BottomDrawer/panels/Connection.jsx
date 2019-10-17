import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../components/LoadResources';
import CeligoTable from '../../../../components/CeligoTable';
import metadata from '../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function ConnectionPanel({ flow }) {
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const classes = useStyles();
  const connectionIds = [];
  const exportIds = [];
  const importIds = [];

  pageGenerators.forEach(pg => {
    exportIds.push(pg._exportId);

    if (pg._connectionId) {
      connectionIds.push(pg._connectionId);
    }
  });
  pageProcessors.forEach(pp => {
    if (pp.type === 'import') {
      importIds.push(pp._importId);
    } else {
      exportIds.push(pp._exportId);
    }

    if (pp._connectionId) {
      connectionIds.push(pp._connectionId);
    }
  });
  const exportList = useSelector(state =>
    selectors.resources(state, 'exports', exportIds)
  );
  const importList = useSelector(state =>
    selectors.resources(state, 'imports', importIds)
  );

  exportList.forEach(e => {
    if (e._connectionId) {
      connectionIds.push(e._connectionId);
    }
  });
  importList.forEach(i => {
    if (i._connectionId) {
      connectionIds.push(i._connectionId);
    }
  });
  const uniqueConnectionIds = [...new Set(connectionIds)];
  const connectionList = useSelector(state =>
    selectors.resources(state, 'connections', uniqueConnectionIds)
  );

  return (
    <div className={classes.root}>
      <LoadResources required resources="connections">
        <CeligoTable
          data={connectionList}
          filterKey="connections"
          {...metadata}
          actionProps={{ resourceType: 'connections' }}
        />
      </LoadResources>
    </div>
  );
}
