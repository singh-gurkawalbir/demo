import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { uniq } from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import { Card, Typography } from '@mui/material';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import {CONNECTORS_TO_IGNORE, NO_RESULT_SEARCH_MESSAGE, WEBHOOK_ONLY_APPLICATIONS} from '../../constants';
import ApplicationImg from '../../components/icons/ApplicationImg';
import {applicationsList} from '../../constants/applications';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import NoResultTypography from '../../components/NoResultTypography';
import PageContent from '../../components/PageContent';
import { getPublishedConnectorName } from '../../utils/assistant';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(204px, 1fr));',
    gridRowGap: theme.spacing(3),
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

  const applications = useMemo(() => {
    let applications = [];

    const lowerCaseFilter = filter?.keyword?.toLowerCase();

    connectors.forEach(c => { applications = applications.concat(c.applications); });
    templates.forEach(t => { applications = applications.concat(t.applications); });
    connectorsMetadata.forEach(c => { applications = applications.concat(c.id); });
    applications = applications.map(app => getPublishedConnectorName(app) || app);
    applications = applications.filter(a => !CONNECTORS_TO_IGNORE.includes(a) && !WEBHOOK_ONLY_APPLICATIONS.includes(a));
    applications = uniq(applications.filter(Boolean));

    applications = applications.sort((a, b) => {
      const nameA = (connectorsMetadata?.find(c => c.id === a) || {}).name || a;
      const nameB = (connectorsMetadata?.find(c => c.id === b) || {}).name || b;

      if (nameA.toLowerCase() < nameB.toLowerCase()) return -1;

      if (nameA.toLowerCase() > nameB.toLowerCase()) return 1;

      return 0; // names must be equal
    });

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

    return applications;
  }, [connectors, connectorsMetadata, filter?.keyword, templates]);

  useEffect(() => {
    dispatch(actions.marketplace.requestConnectors());
    dispatch(actions.marketplace.requestTemplates());
  }, [dispatch]);

  return (
    <>
      {applications.length > 0 ? (
        <PageContent>
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
                  {(connectorsMetadata.find(a => a.id === id) || {}).name || id}
                </Typography>
              </NavLink>
            ))}
          </div>
        </PageContent>
      ) : (
        <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>
      )}
    </>
  );
}
