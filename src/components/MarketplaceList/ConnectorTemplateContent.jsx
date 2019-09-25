import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  description: {
    width: '200px',
    maxHeight: '100px',
    overflowY: 'auto',
    marginTop: theme.spacing(2),
  },
  name: {
    marginTop: theme.spacing(2),
  },
  cardHeader: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    background: props =>
      props.type === 'connector'
        ? theme.palette.primary.dark
        : theme.palette.secondary.light,
    height: '50px',
  },
  user: {
    display: 'inline',
    float: 'right',
    color: 'white',
  },
  title: {
    display: 'inline',
    color: 'white',
  },
}));

export default function ConnectorTemplateContent(props) {
  const { resource, title, application } = props;
  const classes = useStyles(props);

  return (
    <Fragment>
      <div className={classes.cardHeader}>
        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.user}>
          {resource.user &&
            (resource.user.company ||
              resource.user.name ||
              resource.user.email)}
        </Typography>
      </div>
      <ApplicationImg
        assistant={
          resource.applications.length >= 2 &&
          application === resource.applications[0]
            ? resource.applications[1]
            : resource.applications[0]
        }
        size="large"
        imgType="large"
      />
      <Typography className={classes.name} variant="h3">
        {resource.name}
      </Typography>
      <Typography className={classes.description}>
        {resource.description}
      </Typography>
    </Fragment>
  );
}
