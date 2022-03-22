import React from 'react';
import { useSelector } from 'react-redux';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '../../../../icons/ErrorIcon';
import { selectors } from '../../../../../reducers';
import { INTEGRATION_CLONE_ERROR } from '../../../../../utils/revisions';

const useStyles = makeStyles(theme => ({
  descriptionWrapper: {
    marginTop: theme.spacing(0.5),
    lineHeight: '20px',
    '&:empty': {
      display: 'none',
    },
  },
  error: {
    color: theme.palette.error.main,
  },
  icon: {
    marginRight: 3,
    fontSize: theme.spacing(2),
    verticalAlign: 'text-bottom',
  },
}));

export default function FieldMessage({ integrationId }) {
  const classes = useStyles();
  const hasNoClonesToSelect = useSelector(state => {
    const isLoadingCloneFamily = selectors.isLoadingCloneFamily(state, integrationId);
    const cloneList = selectors.cloneFamily(state, integrationId);

    return !isLoadingCloneFamily && !cloneList?.length;
  });

  if (hasNoClonesToSelect) {
    return (
      <FormHelperText
        error
        className={classes.descriptionWrapper}
        component="div">
        <div className={classes.error}>
          <ErrorIcon className={classes.icon} /> {INTEGRATION_CLONE_ERROR}
        </div>
      </FormHelperText>
    );
  }

  return null;
}
