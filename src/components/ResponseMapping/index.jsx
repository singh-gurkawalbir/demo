import React, { useCallback, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import Spinner from '../Spinner';
import actions from '../../actions';
import DrawerContent from '../drawer/Right/DrawerContent';
import DrawerFooter from '../drawer/Right/DrawerFooter';
import FieldMappingForm from './FieldMappingForm';
import { isIntegrationApp } from '../../utils/flows';
import SaveButtonGroup from './SaveButtonGroup';

const useStyles = makeStyles(theme => ({
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
    fontFamily: 'Roboto500',
  },

  root: {
    flex: '1 1 0',
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    height: '100%',
  },
  mappingsBody: {
    height: '100%',
    overflow: 'auto',
  },
}));
const ResponseMapping = ({ flowId, resourceId, integrationId}) => {
  const disabled = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    if (isIntegrationApp(flow)) {
      return false;
    }

    return selectors.isFormAMonitorLevelAccess(state, integrationId);
  });
  const history = useHistory();
  const classes = useStyles();
  const resourceType = useSelector(state => selectors.responseMapping(state).resourceType);
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <>
      <DrawerContent>
        <div className={classes.root}>
          <div className={classes.header}>
            <Typography
              variant="h5"
              className={classes.headerChild}
              key="heading_extract">
              {resourceType === 'imports' ? 'Import' : 'Lookup'} response field
            </Typography>

            <Typography
              variant="h5"
              className={classes.headerChild}
              key="heading_generate">
              Source record field (New/Existing field)
            </Typography>
          </div>
          <div className={classes.mappingsBody}>
            <FieldMappingForm
              disabled={disabled}
              resourceId={resourceId}
              flowId={flowId}
                            />
          </div>
        </div>
      </DrawerContent>
      <DrawerFooter>
        <SaveButtonGroup
          flowId={flowId}
          resourceId={resourceId}
          disabled={disabled}
          onClose={handleClose}
                />
      </DrawerFooter>
    </>
  );
};

export default function ResponseMappingWrapper({integrationId}) {
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
      <Spinner centerAll />
    );
  }

  return (
    <ResponseMapping
      flowId={flowId}
      resourceId={resourceId}
      integrationId={integrationId}
        />
  );
}
