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

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    width: '100%',
  },
  mappingContainer: {
    height: 'calc(100vh - 180px)',
    padding: theme.spacing(1, 0, 3),
    marginBottom: theme.spacing(1),
    maxWidth: '100%',
    flex: '1 1 0',
  },
  mappingsBody: {
    height: 'calc(100% - 54px)',
    overflow: 'auto',
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));
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
