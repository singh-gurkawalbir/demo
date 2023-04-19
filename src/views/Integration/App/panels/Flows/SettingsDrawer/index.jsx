import React, { useMemo} from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { selectors } from '../../../../../../reducers';
import { drawerPaths } from '../../../../../../utils/rightDrawer';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/formFactory/utils';
import LoadResources from '../../../../../../components/LoadResources';
import { IAFormStateManager} from '..';
import useIASettingsStateWithHandleClose from '../../../../../../hooks/useIASettingsStateWithHandleClose';
import RightDrawer from '../../../../../../components/drawer/Right';
import EditorDrawer from '../../../../../../components/AFE/Drawer';

const useStyles = makeStyles(theme => ({
  settingsDrawerForm: {
    overflowY: 'auto',
    padding: theme.spacing(2, 3),
    '& > * div.MuiTabs-vertical': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(2),
      '& > * button > span': {
        justifyContent: 'flex-start',
      },
    },
  },
  settingsDrawerCamForm: {
    '& > div': {
      height: '100%',
      '& > div': {
        paddingBottom: theme.spacing(3),
      },
    },
  },
  settingsDrawerDetails: {
    minHeight: 'calc(100% - 123px)',
  },
}));

function IASettings({ integrationId, childId, parentUrl }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { flowId } = match.params;
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  // TODO: Fix this convoluted way of getting settings for a specific flow.
  // the data layer should have a simple, clean, selector api, that, given a flowId,
  // returns the flow settings. Right now to look up this info, i need to
  // jump through hoops to accomplish a simple lookup. It was also a brutal task to
  // trace existing code and find the solution to this. There were SO many proxied
  // props (all of which would cause re-renders of deep component trees)
  // We have a data-layer for a reason. There is absolutely no reason to proxy data-layer
  // results deeply through many nested components.
  const { settings: fields, sections } = useSelector(
    state => selectors.iaFlowSettings(state, integrationId, flowId, childId),
    shallowEqual

  );
  const flowSettingsMemo = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        { fields, sections },
        integrationId,
        true,
        {
          resource: flow,
          isFlow: true,
          childId,
        }
      ),
    [fields, flow, integrationId, childId, sections]
  );
  const { formState, handleClose } = useIASettingsStateWithHandleClose(
    integrationId,
    flowId,
    null,
    parentUrl
  );

  return (
    <LoadResources required integrationId={integrationId} resources="connections,exports,imports,flows">
      <IAFormStateManager
        className={clsx(classes.settingsDrawerForm, {
          [classes.settingsDrawerCamForm]: sections,
          [classes.settingsDrawerDetails]: !sections,
        })}
        integrationId={integrationId}
        flowId={flowId}
        childId={childId}
        formState={formState}
        fieldMeta={flowSettingsMemo}
        onCancel={handleClose}
        isDrawer
      />
    </LoadResources>
  );
}

export default function SettingsDrawer(props) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.FLOW_BUILDER.IA_SETTINGS}
      height="tall"
      width="xl">
      <IASettings {...props} parentUrl={match.url} />
      <EditorDrawer />
    </RightDrawer>
  );
}
