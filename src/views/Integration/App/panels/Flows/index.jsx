import { useSelector } from 'react-redux';
import {
  Route,
  Link,
  NavLink,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Grid, List, ListItem } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import LoadResources from '../../../../../components/LoadResources';
import PanelHeader from '../../../common/PanelHeader';
import FlowCard from '../../../common/FlowCard';
import IconTextButton from '../../../../../components/IconTextButton';
import SettingsIcon from '../../../../../components/icons/SettingsIcon';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
  },
  subNav: {
    minWidth: 200,
    // height: '100%',
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 0, 3, 0),
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

function FlowList({ integrationId, storeId }) {
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const { flows, fields, sections } = useSelector(state =>
    selectors.integrationAppFlowSettings(
      state,
      integrationId,
      sectionId,
      storeId
    )
  );
  const hasAdvancedSettings = !!fields || !!sections;
  const flowSections = useSelector(state =>
    selectors.integrationAppFlowSections(state, integrationId, storeId)
  );
  const section = flowSections.find(s => s.titleId === sectionId);

  return (
    <LoadResources required resources="flows">
      <PanelHeader title={`${section.title} flows`}>
        {hasAdvancedSettings && (
          <IconTextButton component={Link} to={`${sectionId}/configure`}>
            <SettingsIcon /> Configure {section.title}
          </IconTextButton>
        )}
      </PanelHeader>
      {flows.map(f => (
        <FlowCard key={f._id} flowId={f._id} />
      ))}
    </LoadResources>
  );
}

export default function FlowsPanel({ storeId, integrationId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const flowSections = useSelector(state =>
    selectors.integrationAppFlowSections(state, integrationId, storeId)
  );

  // If someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because different sections exist across IAs.
  if (match.isExact) {
    return (
      <Redirect push={false} to={`${match.url}/${flowSections[0].titleId}`} />
    );
  }

  return (
    <div className={classes.root}>
      <Grid container wrap="nowrap">
        <Grid item className={classes.subNav}>
          <List>
            {flowSections.map(({ title, titleId }) => (
              <ListItem key={titleId}>
                <NavLink
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={titleId}
                  data-test={titleId}>
                  {title}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item className={classes.content}>
          <LoadResources required resources="flows">
            <Route path={`${match.url}/:sectionId`}>
              <FlowList integrationId={integrationId} storeId={storeId} />
            </Route>
          </LoadResources>
        </Grid>
      </Grid>
    </div>
  );
}
