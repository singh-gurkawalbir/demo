import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';
import { STANDALONE_INTEGRATION } from '../../utils/constants';
import AttachFlows from '../../components/AttachFlows';

const useStyles = makeStyles(() => ({
  registerButton: {
    float: 'right',
  },
}));

function Flows(props) {
  const { match } = props;
  const classes = useStyles();
  const { integrationId } = match.params;
  const [showAttachFlowsDialog, setAttachFlowsDialog] = useState(false);
  let flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const standAloneFlows =
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
      {showAttachFlowsDialog && (
        <AttachFlows
          integrationId={integrationId}
          standAloneFlows={standAloneFlows}
          onClose={() => setAttachFlowsDialog(false)}
        />
      )}
      <LoadResources required resources="flows">
        {integrationId && integrationId !== 'none' && (
          <Button
            className={classes.registerButton}
            onClick={() => setAttachFlowsDialog(true)}>
            Attach Flows
          </Button>
        )}

        <ResourceTable resourceType="flows" resources={flows} />
      </LoadResources>
    </Fragment>
  );
}

export default Flows;
