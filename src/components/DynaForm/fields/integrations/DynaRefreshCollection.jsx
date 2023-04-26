import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormControl from '@mui/material/FormControl';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import DynaMultiSelect from '../DynaMultiSelect';
import RefreshIcon from '../../../icons/RefreshIcon';
import ActionButton from '../../../ActionButton';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  refreshResourceWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
  refreshResourceActionBtn: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  refreshRoot: {
    width: '100%',
    overflow: 'hidden',
  },
  refreshLoader: {
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaRefreshCollection(props) {
  const {resourceType} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const isResourceCollectionLoading = useSelector(state => selectors.isResourceCollectionLoading(state, resourceType));

  const onRefresh = useCallback(() => {
    dispatch(actions.resource.requestCollection(resourceType));
  }, [dispatch, resourceType]);

  return (
    <FormControl variant="standard" className={classes.refreshResourceWrapper}>
      <div className={classes.refreshRoot}>
        <DynaMultiSelect {...props} />
      </div>

      {isResourceCollectionLoading ? (
        <span
          className={clsx(
            classes.refreshResourceActionBtn,
            classes.refreshLoader
          )}>
          <Spinner />
        </span>
      ) : (
        <ActionButton
          onClick={onRefresh}
          tooltip="Refresh"
          className={classes.refreshResourceActionBtn}
          data-test="refreshResource">
          <RefreshIcon />
        </ActionButton>
      )}
    </FormControl>
  );
}
