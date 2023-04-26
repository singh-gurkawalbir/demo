import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Chip } from '@mui/material';
import ApplicationImg from '../../components/icons/ApplicationImg';
import CeligoTruncate from '../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  description: {
    minHeight: theme.spacing(13),
    maxHeight: theme.spacing(13),
    overflowY: 'auto',
    fontSize: 15,
  },
  name: {
    fontFamily: 'Roboto400',
    marginTop: theme.spacing(1),
  },
  imgChip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
  },
}));

export default function ConnectorTemplateContent({ resource, application }) {
  const { name, description, free, applications } = resource;
  const classes = useStyles();
  let assistant = applications.length >= 2 && application === applications[0]
    ? applications[1]
    : applications[0];

  // Slight hack here. Both Magento1 and magento2 use same applicationId 'magento', but we need to show different images.
  if (name.indexOf('Magento 1') !== -1 && assistant === 'magento') {
    assistant = 'magento1';
  }

  return (
    <>
      <Typography className={classes.name} variant="body2">
        <CeligoTruncate lines={2} placement="top" enterDelay={100}>
          {name}
        </CeligoTruncate>
      </Typography>
      <div className={classes.imgChip}>
        <ApplicationImg
          assistant={assistant}
          size="small"
        />
        {free && (
          <Chip
            variant="outlined"
            color="primary"
            size="small"
            label="Free"
          />
        )}
      </div>
      <Typography variant="body2" className={classes.description}>
        {description}
      </Typography>
    </>
  );
}
