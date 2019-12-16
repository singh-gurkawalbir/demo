import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Chip } from '@material-ui/core';
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
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '88%',
    textOverflow: 'ellipsis',
  },
  floatRight: {
    position: 'absolute',
    right: '5px',
    top: '50px',
  },
  title: {
    color: theme.palette.background.paper,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '88%',
    textOverflow: 'ellipsis',
  },
  content: {
    padding: theme.spacing(0, 2),
  },
}));

export default function ConnectorTemplateContent({
  resource,
  title,
  application,
}) {
  const { name, description, free, user, applications } = resource;
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.cardHeader}>
        <Typography className={classes.title} title={title}>
          {title}
        </Typography>
        <Typography
          className={classes.user}
          title={user.company || user.name || user.email}>
          {user && (user.company || user.name || user.email)}
        </Typography>
      </div>
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
    </Fragment>
  );
}
