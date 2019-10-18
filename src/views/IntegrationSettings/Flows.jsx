import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import { STANDALONE_INTEGRATION } from '../../utils/constants';
import AttachFlowsDialog from '../../components/AttachFlows';
import getRoutePath from '../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  registerButton: {
    marginRight: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(1),
  },
}));

export default function Flows(props) {
  const { match } = props;
  const classes = useStyles();
  const { integrationId } = match.params;
  const [showDialog, setShowDialog] = useState(false);
  let flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const standaloneFlows =
    flows &&
    flows.filter(
      f =>
        (f._integrationId === STANDALONE_INTEGRATION.id || !f._integrationId) &&
        !!f.sandbox === (preferences.environment === 'sandbox')
    );

  flows =
    flows &&
    flows.filter(
      f =>
        f._integrationId ===
          (integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : integrationId) &&
        !!f.sandbox === (preferences.environment === 'sandbox')
    );

  return (
    <Fragment>
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          standaloneFlows={standaloneFlows}
          onClose={() => setShowDialog(false)}
        />
      )}
      <LoadResources required resources="flows, connections, exports, imports">
        <div className={classes.actions}>
          <Button
            data-test="createFlow"
            className={classes.registerButton}
            component={Link}
            variant="contained"
            color="secondary"
            to={getRoutePath(`/integrations/${integrationId}/flowBuilder/new`)}>
            Create Flow
          </Button>
          <Button
            data-test="loadData"
            className={classes.registerButton}
            variant="contained"
            color="secondary"
            component={Link}
            to={getRoutePath(`/integrations/${integrationId}/data-loader`)}>
            Load Data
          </Button>
          {integrationId && integrationId !== 'none' && (
            <Button
              data-test="attachFlows"
              className={classes.registerButton}
              variant="contained"
              color="secondary"
              onClick={() => setShowDialog(true)}>
              Attach Flows
            </Button>
          )}
        </div>
        <ResourceTable resourceType="flows" resources={flows} />
      </LoadResources>
    </Fragment>
  );
}
