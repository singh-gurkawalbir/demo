import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DrawerContent from '../../../components/drawer/Right/DrawerContent';
import TopPanel from './TopPanel';
import DragContainer from './DragContainer';
import SettingsDrawer from './Settings';
import PreviewPanel from './Preview/Panel';
import DrawerFooter from '../../../components/drawer/Right/DrawerFooter';
import ButtonPanel from './ButtonPanel';
import SalesforceSubListDialog from './SalesforceSubList';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
  },
  mappingContainer: {
    flex: '1 1 0',
    width: 'calc(100% + 24px)',
    overflow: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    marginLeft: -24,
  },
  mappingsBody: {
    height: '100%',
    overflow: 'auto',
  },
});
const SuiteScriptMapping = props => {
  const {onClose, ssLinkedConnectionId } = props;
  const classes = useStyles();
  const isManageLevelUser = useSelector(
    state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId)
  );
  const sfSubListExtractFieldName = useSelector(
    state => selectors.suiteScriptMapping(state, ssLinkedConnectionId).sfSubListExtractFieldName
  );

  return (
    <>
      <DrawerContent>
        <div className={classes.root}>
          <div className={clsx(classes.mappingContainer)}>
            <TopPanel
              disabled={!isManageLevelUser} />
            <div className={classes.mappingsBody}>
              <DragContainer
                disabled={!isManageLevelUser} />
            </div>
          </div>
          <PreviewPanel
            disabled={!isManageLevelUser} />
          <SettingsDrawer
            disabled={!isManageLevelUser} />
          {sfSubListExtractFieldName && (
            <SalesforceSubListDialog />
          )}
        </div>
      </DrawerContent>
      <DrawerFooter>
        <ButtonPanel
          disabled={!isManageLevelUser}
          onClose={onClose} />
      </DrawerFooter>
    </>
  );
};

export default function SuiteScriptMappingWrapper(props) {
  const {ssLinkedConnectionId, integrationId, flowId, subRecordMappingId} = props;
  const dispatch = useDispatch();
  const mappingStatus = useSelector(state => selectors.suiteScriptMapping(state).status);

  useEffect(() => {
    /** initiate a mapping init each time user opens mapping. Sample data is loaded */
    dispatch(actions.suiteScript.mapping.init({
      ssLinkedConnectionId,
      integrationId,
      flowId,
      subRecordMappingId,
    }));

    return () => {
      // clear the mapping list when component unloads.
      dispatch(actions.suiteScript.mapping.clear());
    };
  }, [dispatch, flowId, integrationId, ssLinkedConnectionId, subRecordMappingId]);

  if (mappingStatus === 'error') {
    return (<Typography>{message.MAPPER2.FAILED_TO_LOAD_MAPPING}</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <SuiteScriptMapping {...props} />

  );
}
