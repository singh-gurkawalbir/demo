import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  description: {
    width: '200px',
    maxHeight: '100px',
    overflowY: 'auto',
  },
}));

export default function ConnectorTemplateContent(props) {
  const { resource, title, application } = props;
  const classes = useStyles();

  return (
    <Fragment>
      <div>
        <Typography>{title}</Typography>
        <Typography>
          {resource.user &&
            (resource.user.company ||
              resource.user.name ||
              resource.user.email)}
        </Typography>
      </div>
      <img
        width="100px"
        src={`https://d142hkd03ds8ug.cloudfront.net/images/marketplace/large/${
          resource.applications.length >= 2 &&
          application === resource.applications[0]
            ? resource.applications[1]
            : resource.applications[0]
        }.png`}
        alt={resource.name}
      />
      <Typography variant="h3">{resource.name}</Typography>
      <Typography className={classes.description}>
        {resource.description}
      </Typography>
    </Fragment>
  );
}
