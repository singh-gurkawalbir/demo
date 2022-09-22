import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useSelectorMemo from './selectors/useSelectorMemo';
import menuItems from '../App/CeligoDrawer/menuItems';
import { selectors } from '../reducers';

const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};
export default function useResourceListItems() {
  const userProfile = useSelector(state => selectors.userProfile(state));
  const canUserPublish = useSelector(state => selectors.canUserPublish(state));
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const mfaSessionInfoStatus = useSelector(selectors.mfaSessionInfoStatus);

  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state).accessLevel
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );

  const isSandbox = environment === 'sandbox';
  const marketplaceConnectors = useSelectorMemo(
    selectors.makeMarketPlaceConnectorsSelector,
    undefined,
    isSandbox
  );

  const listItemsMemo = useMemo(() => menuItems(
    {
      userProfile,
      accessLevel,
      integrations,
      canUserPublish,
      marketplaceConnectors,
      isUserInErrMgtTwoDotZero,
      isMFASetupIncomplete,
    }),
  [
    userProfile,
    accessLevel,
    integrations,
    canUserPublish,
    marketplaceConnectors,
    isUserInErrMgtTwoDotZero,
    isMFASetupIncomplete,
  ]);

  // we proceed further only when mfa sessionInfo is received
  if (!mfaSessionInfoStatus || mfaSessionInfoStatus === 'requested') return [];

  return listItemsMemo;
}
