import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { uniq } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import ApplicationImg from '../../components/icons/ApplicationImg';
import {applicationsList} from '../../constants/applications';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(204px, 1fr));',
    gridRowGap: theme.spacing(3),
    padding: '24px 10px',
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(7, 1fr);',
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
    width: '204px',
    paddingTop: theme.spacing(1),
    textAlign: 'center',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function ApplicationsList({ filter }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const sandbox = userPreferences.environment === 'sandbox';
  const connectors = useSelectorMemo(
    selectors.makeMarketPlaceConnectorsSelector,
    undefined,
    sandbox
  );
  const connectorsMetadata = applicationsList();
  const templates = useSelector(state => selectors.marketplaceTemplatesByApp(state));
  let applications = [];
  const lowerCaseFilter = filter?.keyword?.toLowerCase();

  connectors.forEach(c => { applications = applications.concat(c.applications); });
  templates.forEach(t => { applications = applications.concat(t.applications); });
  applications = uniq(applications.filter(Boolean).sort());

  // do not filter the applications if user has not typed in any search string
  if (lowerCaseFilter) {
    applications = applications.filter(
      a => {
        const {name} = connectorsMetadata?.find(c => c.id === a) || {};

        return a.toLowerCase().includes(lowerCaseFilter) ||
               name?.toLowerCase().includes(lowerCaseFilter);
      }
    );
  }
  useEffect(() => {
    dispatch(actions.marketplace.requestConnectors());
    dispatch(actions.marketplace.requestTemplates());
  }, [dispatch]);

  return (
    <>
      {applications.length > 0 ? (
        <div data-public className={classes.root}>
          {applications.map(id => (
            <NavLink
              className={classes.tile}
              key={id}
              to={getRoutePath(`/marketplace/${id}`)}>
              <Card className={classes.card} elevation={0}>
                <ApplicationImg assistant={id} size="large" />
              </Card>
              <Typography variant="body2" className={classes.label}>
                {(connectorsMetadata.find(a => a.id === id) || {}).name || id}
              </Typography>
            </NavLink>
          ))}
        </div>
      ) : (
        <Typography data-public component="div" className={classes.resultContainer}>
          Your search didn’t return any matching results. Try expanding your
          search criteria.
        </Typography>
      )}
    </>
  );
}
