import React, {useCallback} from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import {selectors} from '../../reducers';
import actions from '../../actions';
import TopPanel from './TopPanel';
import ButtonPanel from './ButtonPanel';
import PreviewPanel from './Preview/Panel';
import DragContainer from '../DragContainer';
import SettingsDrawer from './Settings';
import DrawerContent from '../drawer/Right/DrawerContent';
import DrawerFooter from '../drawer/Right/DrawerFooter';
import AutoMapperButton from './AutoMapperButton';
import MappingRow from './MappingRow';
import { emptyObject } from '../../constants';
import { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
  },
  mappingColumn: {
    flex: '1 1 0',
    width: 'calc(100% + 24px)',
    overflow: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    marginLeft: -24,
  },
  mappingTable: {
    height: '100%',
    overflow: 'auto',
  },
  autoMapper: {
    margin: theme.spacing(2, 3),
  },
}));
const SortableItemComponent = props => (
  <MappingRow {...props} />
);
const LastRowSortableItemComponent = props => (
  <MappingRow rowData={emptyObject} {...props} />
);
const Mapping = ({flowId, importId, subRecordMappingId, disabled, onClose}) => {
  const canAutoMap = useSelector(state => {
    if (disabled) {
      return false;
    }
    const generateFields = selectors.mappingGenerates(state, importId, subRecordMappingId);
    const extractFields = selectors.mappingExtracts(state, importId, flowId, subRecordMappingId);

    return generateFields.length > 0 && extractFields.length > 0;
  });
  const classes = useStyles();
  const dispatch = useDispatch();
  const mappings = useSelector(state => selectors.mapping(state).mappings);
  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    dispatch(actions.mapping.shiftOrder(mappings[oldIndex].key, newIndex));
  }, [dispatch, mappings]);

  return (
    <>
      <SettingsDrawer disabled={disabled} />
      <DrawerContent>
        <div className={classes.mappingDrawerContent}>
          <div className={classes.mappingColumn}>
            <TopPanel flowId={flowId} importId={importId} disabled={disabled} />

            <div className={classes.mappingTable}>
              <DragContainer
                disabled={disabled}
                importId={importId}
                flowId={flowId}
                items={mappings}
                SortableItemComponent={SortableItemComponent}
                LastRowSortableItemComponent={LastRowSortableItemComponent}
                onSortEnd={onSortEnd}
                subRecordMappingId={subRecordMappingId}
              />
              {canAutoMap && (
                <div className={classes.autoMapper}>
                  <AutoMapperButton />
                </div>
              )}
            </div>
          </div>
          <PreviewPanel
            importId={importId}
            disabled={disabled}
            subRecordMappingId={subRecordMappingId} />
        </div>
      </DrawerContent>
      <DrawerFooter>
        <ButtonPanel
          flowId={flowId}
          importId={importId}
          disabled={disabled}
          onClose={onClose}
           />
      </DrawerFooter>
    </>
  );
};

export default function MappingWrapper(props) {
  const {
    flowId,
    importId,
    subRecordMappingId,
  } = props;
  const mappingStatus = useSelector(state => selectors.mapping(state, flowId, importId, subRecordMappingId).status);

  if (mappingStatus === 'error') {
    return (<Typography>{message.MAPPER2.FAILED_TO_LOAD_MAPPING}</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <Mapping {...props} />
  );
}
