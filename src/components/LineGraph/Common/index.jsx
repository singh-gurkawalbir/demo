import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import ConditionalIcon from '../../icons/ConditionalIcon';
import OptionalIcon from '../../icons/OptionalIcon';
import PreferredIcon from '../../icons/PreferredIcon';
import RequiredIcon from '../../icons/RequiredIcon';

const useStyles = makeStyles(theme => ({

  legendIcon: {
    width: '12px',
    height: '12px',
  },
  legendText: {
    margin: theme.spacing(0, 1),
  },

}));
export const getIcon = index => {
  const Symbols = [OptionalIcon, ConditionalIcon, PreferredIcon, RequiredIcon];

  return Symbols[index % 4];
};

export const DataIcon = ({index}) => {
  const Icon = getIcon(index);
  const classes = useStyles();

  return (
    <Icon
      className={clsx(classes.legendIcon, classes[`${(index % 8) + 1}Color`])}
      />
  );
};

export const getResourceName = ({name, isResolvedGraph, flowResources}) => {
  if (!name || typeof name !== 'string') {
    return name || '';
  }
  const resourceId = name.split('-')[0];

  if (isResolvedGraph) {
    return resourceId === 'autopilot' || resourceId === 'auto' ? 'Auto-resolved' : 'Users';
  }
  let modifiedName = resourceId;
  const resource = flowResources.find(r => r._id === resourceId);

  if (resource) {
    modifiedName = resource.name;
  }

  return modifiedName;
};
