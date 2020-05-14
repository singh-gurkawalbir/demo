import { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import TimeAgo from 'react-timeago';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, IconButton } from '@material-ui/core';
import DebugIcon from '../../icons/DebugIcon';
import EditIcon from '../../icons/EditIcon';
import EllipsisMenu from './ConnectionEllipsisMenu';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import ResourceDrawer from '../../../components/drawer/Resource';

const useStyles = makeStyles(theme => ({
  cardContent: {
    display: 'flex',
    flexGrow: 1,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderLeft: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    wordBreak: 'break-word',
  },
  block: {
    height: 50,
    width: 50,
    border: `1px solid black`,
  },
  statusBar: {
    width: 6,
    minWidth: 6,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  main: {
    display: 'flex',
    margin: theme.spacing(1, 2),
  },
  online: {
    backgroundColor: theme.palette.success.main,
  },
  offline: {
    backgroundColor: theme.palette.error.main,
  },
}));

export default function ConnectionRow({ connection }) {
  const history = useHistory();
  const match = useRouteMatch();
  const classes = useStyles();
  const {
    _id,
    name,
    offline,
    type,
    rest = {},
    http = {},
    queueSize = 0,
    lastModified,
  } = connection;
  const api = useMemo(() => {
    if (type === 'rest') return rest.baseURI;

    if (type === 'http') return http.baseURI;
  }, [http.baseURI, rest.baseURI, type]);
  const handleEditConnection = useCallback(() => {
    history.push(`${match.url}/edit/connections/${_id}`);
  }, [_id, history, match.url]);
  const handleDebugger = useCallback(() => {
    history.push(`${match.url}/${_id}/debugger`);
  }, [_id, history, match.url]);

  return (
    <div className={classes.main}>
      <div
        className={clsx(classes.statusBar, {
          [classes.online]: !offline,
          [classes.offline]: offline,
        })}
      />
      <div className={classes.cardContent}>
        <Grid container xs={12}>
          <Grid container xs={12}>
            <Grid container xs={8} direction="column">
              <Grid item xs>
                <Typography variant="caption" component="span">
                  {name}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="caption" component="span">
                  Status: {offline ? 'Offline' : 'Online'}
                </Typography>
              </Grid>
            </Grid>
            <Grid container xs={4} spacing={2} direction="row">
              <Grid item xs={2}>
                <IconButton
                  data-test="editConnection"
                  size="small"
                  onClick={handleEditConnection}>
                  <EditIcon />
                </IconButton>
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  data-test="openDebugger"
                  size="small"
                  onClick={handleDebugger}>
                  <DebugIcon />
                </IconButton>
              </Grid>
              <Grid item xs={2}>
                <EllipsisMenu connectionId={_id} />
              </Grid>
              <Grid item xs={6}>
                <ApplicationImg size="small" type={type} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container xs={12} direction="column">
            <Grid item xs>
              <Typography variant="caption" component="span">
                API: {api}
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography variant="caption" component="span">
                Queue: {queueSize}
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography variant="caption" component="span">
                Last updated: <TimeAgo date={lastModified} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <ResourceDrawer />
    </div>
  );
}
