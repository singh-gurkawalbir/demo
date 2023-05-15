import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Box, TabContext, TabList, TabPanel, Tab } from '@celigo/fuse-ui';
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
import { FilledButton } from '../../../Buttons';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

const allTabs = {
  changes: { type: 'changes', label: 'View resources changed' },
  details: { type: 'details', label: 'View details'},
};

function ViewRevisionDetailsContent({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const history = useHistory();
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
        <TabContext value={mode}>
          <Box
            sx={theme => ({
              height: `calc(100% - ${theme.spacing(2)})`,
              backgroundColor: 'white',
              border: `1px solid ${theme.palette.secondary.lightest}`,
              color: theme.palette.text.hint,
              display: 'flex',
              flexDirection: 'column',
              '& .MuiTab-root': { minWidth: 'auto' },
            })}>
            <TabList onChange={handleModeChange}>
              { availableTabs.map(({ label, type }) => <Tab key={type} label={label} id={type} value={type} />)}
              {
                mode === 'changes' && (
                  <ActionGroup position="right">
                    <ExpandAllResourceDiff integrationId={integrationId} />
                  </ActionGroup>
                )
              }
            </TabList>
            <TabPanel
              value="changes"
              id="changes"
              aria-labelledby="changes">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: 'none',
                  overflowY: 'auto',
                  borderTop: theme => `1px solid ${theme.palette.secondary.lightest}`,
                  p: theme => theme.spacing(2),
                }}
                id="changes"
                aria-labelledby="changes">
                <ViewResourceChanged integrationId={integrationId} revisionId={revisionId} />
              </Box>
            </TabPanel>
            <TabPanel
              value="details"
              >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderBottom: 'none',
                  overflowY: 'auto',
                  borderTop: theme => `1px solid ${theme.palette.secondary.lightest}`,
                }}
                id="details"
                aria-labelledby="details"
              >
                <ViewDetails integrationId={integrationId} revisionId={revisionId} />
              </Box>
            </TabPanel>
          </Box>
        </TabContext>
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
