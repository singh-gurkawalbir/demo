import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Tabs, Tab } from '@mui/material';
import { useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { FilledButton } from '@celigo/fuse-ui';
import DrawerContent from '../../Right/DrawerContent';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerFooter from '../../Right/DrawerFooter';
import RightDrawer from '../../Right';
import { selectors } from '../../../../reducers';
import { REVISION_STATUS, REVISION_TYPES } from '../../../../constants';
import ViewResourceChanged from './ResourcesChanged';
import ViewDetails from './RevisionDetails';
import ExpandAllResourceDiff from '../components/ExpandAllResourceDiff';
import useHandleInvalidRevision from '../hooks/useHandleInvalidRevision';
import ActionGroup from '../../../ActionGroup';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

const allTabs = {
  changes: { type: 'changes', label: 'View resources changed' },
  details: { type: 'details', label: 'View details'},
};

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: `calc(100% - ${theme.spacing(2)})`,
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    color: theme.palette.text.hint,
    display: 'flex',
    flexDirection: 'column',
  },
  tabContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: 'none',
    overflowY: 'auto',
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  tabHeader: {
    '& .MuiTab-root': {
      minWidth: 'auto',
    },
  },
  resourceDiffContainer: {
    margin: theme.spacing(2),
  },
}));

function TabPanel({ children, value, type }) {
  const classes = useStyles();
  const hidden = value !== type;

  if (hidden) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={classes.tabContent}
      id={type}
      aria-labelledby={type}>
      {children}
    </div>
  );
}

function ViewRevisionDetailsContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const { revisionId, mode } = match.params;

  useHandleInvalidRevision({ integrationId, revisionId, parentUrl });

  const accessibleTabs = useSelector(state => {
    const revision = selectors.revision(state, integrationId, revisionId);

    if (!revision) return [];
    const { type, status} = revision;

    if (status === REVISION_STATUS.COMPLETED && type !== REVISION_TYPES.SNAPSHOT) {
      return ['changes', 'details'];
    }

    return ['details'];
  }, shallowEqual);

  if (!accessibleTabs.includes(mode)) {
    history.replace(parentUrl);
  }
  const drawerTitle = useSelector(state => selectors.revision(state, integrationId, revisionId)?.description);
  const availableTabs = accessibleTabs.map(tabId => allTabs[tabId]);

  const handleModeChange = (_, newMode) => history.push(buildDrawerUrl({
    path: drawerPaths.LCM.VIEW_REVISION_DETAILS,
    baseUrl: parentUrl,
    params: { revisionId, mode: newMode },
  }));
  const onClose = () => {
    history.replace(parentUrl);
  };

  return (
    <>
      <DrawerHeader title={drawerTitle} handleClose={onClose} />
      <DrawerContent>
        <div className={classes.detailsContainer}>
          <Tabs
            value={mode}
            onChange={handleModeChange}
            className={classes.tabHeader}
            textColor="primary"
            indicatorColor="primary"
        >
            {
            availableTabs.map(({ label, type }) => (
              <Tab
                key={type} label={label} id={type} value={type} />
            ))
            }
            {
              mode === 'changes' && (
                <ActionGroup position="right">
                  <ExpandAllResourceDiff integrationId={integrationId} />
                </ActionGroup>
              )
            }
          </Tabs>
          <TabPanel value={mode} type="changes">
            <div className={classes.resourceDiffContainer}>
              <ViewResourceChanged integrationId={integrationId} revisionId={revisionId} />
            </div>
          </TabPanel>
          <TabPanel value={mode} type="details">
            <ViewDetails integrationId={integrationId} revisionId={revisionId} />
          </TabPanel>
        </div>
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="cancelViewChanges"
          onClick={onClose}>
          Close
        </FilledButton>
      </DrawerFooter>
    </>
  );
}
export default function ViewRevisionDetails({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.LCM.VIEW_REVISION_DETAILS}
      height="tall"
      width="xl">
      <ViewRevisionDetailsContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
