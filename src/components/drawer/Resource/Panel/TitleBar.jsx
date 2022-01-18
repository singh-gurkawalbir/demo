import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { useLocation, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import DrawerHeader from '../../Right/DrawerHeader';
import CloseButton from './CloseButton';
import Back from '../../../icons/BackArrowIcon';
import { isNewId } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import TitleActions from './TitleActions';
import { isNestedDrawer } from '.';

const useStyles = makeStyles(theme => ({
  backButton: {
    marginRight: theme.spacing(1),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },
  titleImgBlock: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
  },
  titleText: {
    wordBreak: 'break-word',
    paddingRight: theme.spacing(2),
    color: theme.palette.secondary.main,
  },
  nestedDrawerTitleText: {
    maxWidth: '90%',
  },
}));
const getTitle = ({ resourceType, resourceLabel, opTitle }) => {
  if (resourceType === 'eventreports') {
    return 'Run report';
  }
  if (resourceType === 'pageGenerator') {
    return 'Create source';
  }

  if (['accesstokens', 'apis', 'connectors'].includes(resourceType)) {
    return `${opTitle} ${resourceLabel}`;
  }

  if (!resourceLabel) { return ''; }

  return `${opTitle} ${resourceLabel.toLowerCase()}`;
};

const ResourceTitle = ({ flowId, onClose }) => {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();
  const { id, resourceType } = match.params || {};
  const resourceLabel = useSelector(state =>
    selectors.getCustomResourceLabel(state, {
      resourceId: id,
      resourceType,
      flowId,
    })
  );
  const title = useMemo(
    () =>
      getTitle({
        resourceType,
        queryParamStr: location.search,
        resourceLabel,
        opTitle: isNewId(id) ? 'Create' : 'Edit',
      }),
    [id, location.search, resourceLabel, resourceType]
  );

  const showBackButton = isNestedDrawer(match.url);

  return (
    <>
      <div className={classes.title}>
        {showBackButton && (
        <IconButton
          data-test="backDrawer"
          className={classes.backButton}
          onClick={onClose}>
          <Back />
        </IconButton>
        )}

        <div className={classes.titleImgBlock}>
          <Typography variant="h4" className={clsx(classes.titleText, {[classes.nestedDrawerTitleText]: showBackButton})}>
            {title}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default function TitleBar({ flowId, formKey, onClose }) {
  const ResourceCloseButton = <CloseButton formKey={formKey} />;

  return (
    <DrawerHeader
      title={<ResourceTitle flowId={flowId} onClose={onClose} />}
      CloseButton={ResourceCloseButton}
      hideBackButton
    >
      <TitleActions flowId={flowId} />
    </DrawerHeader>
  );
}
