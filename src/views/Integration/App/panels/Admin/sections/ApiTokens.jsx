import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import ResourceDrawer from '../../../../../../components/drawer/Resource';
import PanelHeader from '../../../../common/PanelHeader';
import ResourceTable from '../../../../../../components/ResourceTable';
import IconTextButton from '../../../../../../components/IconTextButton';
import LoadResources from '../../../../../../components/LoadResources';
import AddIcon from '../../../../../../components/icons/AddIcon';
import { generateNewId } from '../../../../../../utils/resource';

const useStyles = makeStyles(theme => ({
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function ApiTokenSection({ integrationId }) {
  const classes = useStyles();
  const location = useLocation();
  const match = useRouteMatch();
  const list = useSelector(state =>
    selectors.accessTokenList(state, { integrationId })
  );

  return (
    <Fragment>
      <ResourceDrawer match={match} />

      <PanelHeader title="API tokens">
        <IconTextButton
          data-test="newAccessToken"
          component={Link}
          to={`${location.pathname}/add/accesstokens/${generateNewId()}`}
          variant="text"
          color="primary">
          <AddIcon /> New Access Token
        </IconTextButton>
      </PanelHeader>

      <div className={classes.resultContainer}>
        <LoadResources required resources="accesstokens">
          {list.resources && list.resources.length > 0 ? (
            <ResourceTable
              resourceType="accesstokens"
              resources={list.resources}
            />
          ) : (
            <Typography>
              No API tokens yet exist for this integration.
            </Typography>
          )}
        </LoadResources>
      </div>
    </Fragment>
  );
}
