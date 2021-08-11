import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import { selectors } from '../../../../reducers';
import MappingWrapper from './MappingWrapper';
import useFormOnCancelContext from '../../../../components/FormOnCancelContext';
import { SUITESCRIPT_MAPPINGS_FORM_KEY, MAPPING_SAVE_STATUS } from '../../../../utils/constants';

export default function SuiteScriptMappingDrawer(props) {
  const {ssLinkedConnectionId, integrationId} = props;
  const match = useRouteMatch();
  const flowId = props.flowId || match.params.flowId;
  const history = useHistory();
  const isManageLevelUser = useSelector(
    state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId)
  );
  const { saveStatus, mappings } = useSelector(state => selectors.suiteScriptMapping(state), shallowEqual);
  const {setCancelTriggered} = useFormOnCancelContext(SUITESCRIPT_MAPPINGS_FORM_KEY);
  const isMappingLoaded = !!mappings;
  const closeDisabled = saveStatus === MAPPING_SAVE_STATUS.REQUESTED;

  const showFullWidth = isManageLevelUser && isMappingLoaded;
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <RightDrawer
      path={['mapping', ':flowId/mapping']}
      height="tall"
      width={showFullWidth ? 'full' : 'large'}
      variant="temporary"
      >
      <DrawerHeader disableClose={closeDisabled} handleClose={setCancelTriggered} title="Import Mapping" />
      <MappingWrapper
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        flowId={flowId}
        onClose={handleClose} />
    </RightDrawer>
  );
}
