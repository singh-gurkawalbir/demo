import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Chip } from '@material-ui/core';
import ApplicationImg from '../../components/icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  description: {
    maxHeight: '60px',
    overflowY: 'auto',
    margin: theme.spacing(1, 0, 1, 0),
  },
  name: {
    marginTop: theme.spacing(2),
  },
  floatRight: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(3),
  },
}));

export default function ConnectorTemplateContent({ resource, application }) {
  const { name, description, free, applications } = resource;
  const classes = useStyles();

  return (
    <>
      <div className={classes.content}>
        <ApplicationImg
          assistant={
            applications.length >= 2 && application === applications[0]
              ? applications[1]
              : applications[0]
          }
          size="large"
        />
        {free && (
          <Chip
            variant="outlined"
            color="primary"
            size="small"
            label="Free"
            className={classes.floatRight}
          />
        )}
        <Typography className={classes.name} variant="h3">
          {name}
        </Typography>
        <Typography variant="body2" className={classes.description}>
          {description}
        </Typography>
      </div>
    </>
  );
}
