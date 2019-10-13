import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  description: {
    maxHeight: '60px',
    overflowY: 'auto',
    margin: theme.spacing(1, 0, 1, 0),
  },
  name: {
    marginTop: theme.spacing(2),
  },
  cardHeader: {
    marginBottom: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    padding: '12px',
    background: props =>
      props.type === 'connector'
        ? theme.palette.primary.dark
        : theme.palette.secondary.light,
  },
  user: {
    color: theme.palette.background.paper,
    textAlign: 'right',
    wordBreak: 'break-word',
  },
  title: {
    color: theme.palette.background.paper,
    maxWidth: '50%',
  },
  content: {
    padding: theme.spacing(0, 2),
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
      <div className={classes.content}>
        <ApplicationImg
          assistant={
            resource.applications.length >= 2 &&
            application === resource.applications[0]
              ? resource.applications[1]
              : resource.applications[0]
          }
          size="large"
        />
        <Typography className={classes.name} variant="h3">
          {resource.name}
        </Typography>
        <Typography variant="body2" className={classes.description}>
          {resource.description}
        </Typography>
      </div>
    </Fragment>
  );
}
