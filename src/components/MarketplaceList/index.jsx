import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import { getApplicationConnectors } from '../../constants/applications';
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
  let applicationConnectors = getApplicationConnectors();
  let applications = [];

  connectors.forEach(c => (applications = applications.concat(c.applications)));
  templates.forEach(t => (applications = applications.concat(t.applications)));
  applicationConnectors = applicationConnectors.filter(connector =>
    applications.includes(connector.id)
  );
  useEffect(() => {
    dispatch(actions.marketplace.requestConnectors());
    dispatch(actions.marketplace.requestTemplates());
  }, [dispatch]);

  return (
    <Fragment>
      <div className={classes.root}>
        {applicationConnectors.map(connector => (
          <NavLink
            className={classes.tile}
            key={connector.id}
            to={getRoutePath(`/marketplace/${connector.id}`)}>
            <Card className={classes.card} elevation={0}>
              <ApplicationImg assistant={connector.id} size="large" />
            </Card>
            <Typography variant="body2" className={classes.label}>
              {connector.name}
            </Typography>
          </NavLink>
        ))}
      </div>
    </Fragment>
  );
}
