import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { uniq } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(204px, 1fr));`,
    gridRowGap: theme.spacing(3),
    padding: '24px 10px',
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: `repeat(7, 1fr);`,
    },
  },
  card: {
    width: '204px',
    height: '204px',
    cursor: 'pointer',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.palette.secondary.lightest,
  },
  tile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  label: {
    textTransform: 'capitalize',
    paddingTop: theme.spacing(1),
  },
}));

export default function MarketplaceList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const sandbox = userPreferences.environment === 'sandbox';
  const connectors = useSelector(state =>
    selectors.marketplaceConnectors(state, undefined, sandbox)
  );
  const templates = useSelector(state => selectors.marketplaceTemplates(state));
  let applications = [];

  connectors.forEach(c => (applications = applications.concat(c.applications)));
  templates.forEach(t => (applications = applications.concat(t.applications)));
  applications = uniq(applications.filter(Boolean));

  useEffect(() => {
    dispatch(actions.marketplace.requestConnectors());
    dispatch(actions.marketplace.requestTemplates());
  }, [dispatch]);

  return (
    <Fragment>
      <div className={classes.root}>
        {applications.map(id => (
          <NavLink
            className={classes.tile}
            key={id}
            to={getRoutePath(`/marketplace/${id}`)}>
            <Card className={classes.card} elevation={0}>
              <ApplicationImg assistant={id} size="large" />
            </Card>
            <Typography variant="body2" className={classes.label}>
              {id}
            </Typography>
          </NavLink>
        ))}
      </div>
    </Fragment>
  );
}
