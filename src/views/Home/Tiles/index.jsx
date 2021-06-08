import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import LoadResources from '../../../components/LoadResources';
import DashboardCard from '../DashboardCard';
import { sortTiles } from '../util';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import { TILE_STATUS } from '../../../utils/constants';

export default function DashboardTiles() {
  const tilesOrder = useSelector(
    state => selectors.userPreferences(state)?.dashboard?.tilesOrder);

  const tiles = useSelectorMemo(selectors.mkTiles);
  const ssTiles = useSelector(state => selectors.suiteScriptLinkedTiles(state));
  const suiteScriptLinkedTiles = useMemo(() => ssTiles.filter(t => {
    // only fully configured svb tile should be shown on dashboard
    const isPendingSVB = t._connectorId === 'suitescript-svb-netsuite' && (t.status === TILE_STATUS.IS_PENDING_SETUP || t.status === TILE_STATUS.UNINSTALL);

    return !isPendingSVB;
  }), [ssTiles]);
  const sortedTiles = useMemo(
    () =>
      sortTiles(
        tiles.concat(suiteScriptLinkedTiles),
        tilesOrder
      ),
    [tilesOrder, suiteScriptLinkedTiles, tiles]
  );

  return (

    <LoadResources
      required
      resources="published,integrations,connections,marketplacetemplates">
      <DashboardCard sortedTiles={sortedTiles} />
    </LoadResources>
  );
}
