import React, { useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import TopPanel from './TopPanel';
import ButtonPanel from './ButtonPanel';
import PreviewPanel from './Preview/Panel';
import DragContainer from './DragContainer';
import actions from '../../actions';
import SettingsDrawer from './Settings';
import DrawerContent from '../drawer/Right/DrawerContent';
import DrawerFooter from '../drawer/Right/DrawerFooter';
import AutoMapperButton from './AutoMapperButton';

const useStyles = makeStyles(theme => ({
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
  },
  mappingColumn: {
    width: 'calc(100% + 24px)',
    overflow: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    marginLeft: -24,
  },
  mappingTable: {
    overflow: 'auto',
  },
  autoMapper: {
    margin: theme.spacing(2, 3),
  },
}));
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
  const dispatch = useDispatch();
  const mappingStatus = useSelector(state => selectors.mapping(state, flowId, importId, subRecordMappingId).status);

  useEffect(() => {
    /** initiate a mapping init each time user opens mapping. Sample data is loaded */
    dispatch(actions.mapping.init({
      flowId,
      importId,
      subRecordMappingId,
    }));

    return () => {
      // clear the mapping list when component unloads.
      dispatch(actions.mapping.clear());
    };
  }, [dispatch, flowId, importId, subRecordMappingId]);

  if (mappingStatus === 'error') {
    return (<Typography>Failed to load mapping.</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (

      <Spinner centerAll />

    );
  }

  return (
    <Mapping {...props} />
  );
}
