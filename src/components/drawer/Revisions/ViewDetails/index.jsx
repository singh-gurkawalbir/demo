import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import DrawerContent from '../../Right/DrawerContent';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerFooter from '../../Right/DrawerFooter';
import RightDrawer from '../../Right';
import { selectors } from '../../../../reducers';
import { REVISION_STATUS, REVISION_TYPES } from '../../../../utils/constants';
import ViewResourceChanged from './ResourcesChanged';
import ViewDetails from './RevisionDetails';
import ExpandAllResourceDiff from '../ExpandAllResourceDiff';
import ActionGroup from '../../../ActionGroup';
import { FilledButton } from '../../../Buttons';

const allTabs = {
  changes: { type: 'changes', label: 'View resources changed' },
  details: { type: 'details', label: 'View details'},
};

const useStyles = makeStyles(theme => ({
  detailsContainer: {
    height: '100%',
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
    borderTop: 'none',
    borderBottom: 'none',
  },
  tabHeader: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  resourceDiffContainer: {
    margin: theme.spacing(2),
    overflowY: 'auto',
    height: 550, // TODO: Check with karthik
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

  const { revId, mode } = match.params;
  const accessibleTabs = useSelector(state => {
    const revision = selectors.revision(state, integrationId, revId);

    if (!revision) return [];
    const { type, status} = revision;

    if (status === REVISION_STATUS.COMPLETED && type !== REVISION_TYPES.SNAPSHOT) {
      return ['changes', 'details'];
    }

    return ['details'];
  }, shallowEqual);

  const drawerTitle = useSelector(state => selectors.revision(state, integrationId, revId)?.description);
  const availableTabs = accessibleTabs.map(tabId => allTabs[tabId]);

  const handleModeChange = (_, newMode) => history.push(`${parentUrl}/view/${revId}/mode/${newMode}`);
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
            availableTabs.map(({ label, type }) =>
              <Tab key={type} label={label} id={type} value={type} />)
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
              <ViewResourceChanged integrationId={integrationId} revisionId={revId} />
            </div>
          </TabPanel>
          <TabPanel value={mode} type="details">
            <ViewDetails integrationId={integrationId} revisionId={revId} />
          </TabPanel>
        </div>
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="cancelViewChanges"
          onClick={onClose}>
          Cancel
        </FilledButton>
      </DrawerFooter>
    </>
  );
}
export default function ViewRevisionDetails({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path="view/:revId/mode/:mode"
      variant="temporary"
      height="tall"
      width="full">
      <ViewRevisionDetailsContent integrationId={integrationId} parentUrl={match.url} />
    </RightDrawer>
  );
}
