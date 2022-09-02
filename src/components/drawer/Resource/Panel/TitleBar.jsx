import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { useLocation, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import DrawerHeader from '../../Right/DrawerHeader';
import CloseButton from './CloseButton';
import { isNewId } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import TitleActions from './TitleActions';
import FormView from '../../../DynaForm/fields/DynaConnectionFormView';

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

const ResourceTitle = ({ flowId }) => {
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

  return (
    <div className={classes.title}>
      <div className={classes.titleImgBlock}>
        <Typography variant="h4" className={clsx(classes.titleText)}>
          {title}
        </Typography>
      </div>
    </div>
  );
};

export default function TitleBar({ flowId, formKey, onClose }) {
  const match = useRouteMatch();
  const { id, resourceType } = match.params || {};
  const ResourceCloseButton = <CloseButton formKey={formKey} />;

  return (
    <DrawerHeader
      title={<ResourceTitle flowId={flowId} />}
      CloseButton={ResourceCloseButton}
      handleBack={onClose} >
      <FormView formKey={formKey} resourceType={resourceType} resourceId={id} defaultValue="false" />
      <TitleActions flowId={flowId} />
    </DrawerHeader>
  );
}
