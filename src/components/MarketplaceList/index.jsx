import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import { getApplicationConnectors } from '../../constants/applications';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    margin: theme.spacing(1),
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(4),
    width: '200px',
    height: '200px',
    cursor: 'pointer',
    float: 'left',
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
            key={connector.id}
            to={getRoutePath(`/marketplace/${connector.id}`)}>
            <Card className={classes.card}>
              <ApplicationImg
                assistant={connector.id}
                size="large"
                imgType="large"
              />
            </Card>
          </NavLink>
        ))}
      </div>
    </Fragment>
  );
}
