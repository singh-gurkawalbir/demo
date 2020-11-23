import React, { useCallback, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import SpinnerWrapper from '../SpinnerWrapper';
import actions from '../../actions';
import DrawerContent from '../drawer/Right/DrawerContent';
import DrawerFooter from '../drawer/Right/DrawerFooter';
import FieldMappingWrapper from './FieldMappingWrapper';
import ButtonPanel from './ButtonPanel';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1.5),
    alignItems: 'center',
  },
  headerChild: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: theme.spacing(3),
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
}));
const ResponseMapping = props => {
  const {flowId, resourceId} = props;
  // replace with logic
  const disabled = false; // hardcoded
  const history = useHistory();
  const classes = useStyles();
  // replace with logic hardcoded
  const resourceType = 'imports';
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <DrawerContent>
        <div className={classes.root}>
          <div className={clsx(classes.mappingContainer)}>
            <div className={classes.header}>
              <Typography
                variant="subtitle2"
                className={classes.headerChild}
                key="heading_extract">
                {resourceType === 'imports' ? 'Import' : 'Lookup'} response field
              </Typography>

              <Typography
                variant="subtitle2"
                className={classes.headerChild}
                key="heading_generate">
                Source record field (New/Existing field)
              </Typography>
            </div>
            <div className={classes.mappingsBody}>
              <FieldMappingWrapper
                disabled={disabled}
                resourceId={resourceId}
                flowId={flowId}
            />
            </div>
          </div>
        </div>
      </DrawerContent>
      <DrawerFooter>
        <ButtonPanel
          flowId={flowId}
          resourceId={resourceId}
          disabled={disabled}
          onClose={handleClose}
           />
      </DrawerFooter>
    </>
  );
};

export default function ResponseMappingWrapper() {
  const match = useRouteMatch();
  const { flowId, resourceId } = match.params;
  const dispatch = useDispatch();
  const mappingStatus = useSelector(state => selectors.responseMapping(state).status);

  useEffect(() => {
    /** initiate a response mapping init each time user opens */
    dispatch(actions.responseMapping.init({
      flowId,
      resourceId,
    }));

    return () => {
      // clear the mapping list when component unloads.
      dispatch(actions.mapping.clear());
    };
  }, [dispatch, flowId, resourceId]);

  if (mappingStatus === 'error') {
    return (<Typography>Failed to load response mapping.</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <ResponseMapping
      flowId={flowId}
      resourceId={resourceId}
     />
  );
}
