import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import PanelHeader from '../../../../../../components/PanelHeader';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/suiteScript/flows/metadata';
import ScheduleDrawer from '../../../../FlowBuilder/drawers/Schedule';
import SuiteScriptMappingDrawer from '../../../../Mappings/Drawer';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function FlowsPanel({ ssLinkedConnectionId, integrationId }) {
  const classes = useStyles();
  const flows = useSelector(state =>
    selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    })
  );

  return (
    <div className={classes.root}>
      <ScheduleDrawer ssLinkedConnectionId={ssLinkedConnectionId} />
      <SuiteScriptMappingDrawer
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        />
      <PanelHeader title="Integration flows" />
      <LoadSuiteScriptResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        resources="flows"
      >
        <CeligoTable
          data={customCloneDeep(flows)}
          {...metadata}
          actionProps={{ ssLinkedConnectionId, integrationId }}
        />
      </LoadSuiteScriptResources>
    </div>
  );
}
