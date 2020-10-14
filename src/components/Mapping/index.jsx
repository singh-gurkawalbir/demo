import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import SpinnerWrapper from '../SpinnerWrapper';
import TopPanel from './TopPanel';
import ButtonPanel from './ButtonPanel';
import PreviewPanel from './Preview/Panel';
import DragContainer from './DragContainer';
import actions from '../../actions';
import SettingsDrawer from './Settings';

const useStyles = makeStyles({
  root: {
    height: '100%',
    display: 'flex',
    width: '100%',
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
const Mapping = props => {
  const {flowId, importId, subRecordMappingId, disabled, onClose} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.mappingContainer)}>
        <TopPanel
          flowId={flowId}
          importId={importId}
          disabled={disabled}
        />
        <div className={classes.mappingsBody}>
          <DragContainer
            disabled={disabled}
            importId={importId}
            flowId={flowId}
            subRecordMappingId={subRecordMappingId}
          />
        </div>
        <ButtonPanel
          flowId={flowId}
          importId={importId}
          disabled={disabled}
          onClose={onClose}
           />
      </div>
      <PreviewPanel
        importId={importId}
        disabled={disabled}
        subRecordMappingId={subRecordMappingId}
      />
      <SettingsDrawer
        disabled={disabled}
      />
    </div>
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

  if (mappingStatus !== 'received') {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <Mapping {...props} />
  );
}
