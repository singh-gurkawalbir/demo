import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import {
  Route,
  Link,
  NavLink,
  Redirect,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles, Grid, List, ListItem } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import LoadResources from '../../../../../components/LoadResources';
import IconTextButton from '../../../../../components/IconTextButton';
import SettingsIcon from '../../../../../components/icons/SettingsIcon';
import PanelHeader from '../../../../../components/PanelHeader';
import FlowCard from '../../../common/FlowCard';
import ConfigureDrawer from './ConfigureDrawer';
import SettingsDrawer from './SettingsDrawer';
import CategoryMappingDrawer from './CategoryMappingDrawer';
import AddCategoryMappingDrawer from './CategoryMappingDrawer/AddCategory';
import VariationMappingDrawer from './CategoryMappingDrawer/VariationMapping';
import MappingDrawer from '../../../common/MappingDrawer';
import actions from '../../../../../actions';
import { FormStateManager } from '../../../../../components/ResourceFormFactory';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 0, 3, 0),
    overflowX: 'scroll',
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  configureSectionBtn: {
    padding: 0,
  },
}));

export const IAFormStateManager = props => {
  const dispatch = useDispatch();
  const { integrationId, flowId, sectionId } = props;
  const allProps = {
    ...props,
    resourceType: 'integrations',
    resourceId: integrationId,
  };

  useEffect(() => {
    dispatch(
      actions.integrationApp.settings.initComplete(
        integrationId,
        flowId,
        sectionId
      )
    );

    return () => {
      dispatch(
        actions.integrationApp.settings.clear(integrationId, flowId, sectionId)
      );
    };
  }, [dispatch, flowId, integrationId, sectionId]);

  return <FormStateManager {...allProps} isIAForm />;
};

function FlowList({ integrationId, storeId }) {
  const classes = useStyles();
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
    <LoadResources required resources="flows,exports">
      <ConfigureDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
      />
      <SettingsDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
      />
      <MappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
      />
      <CategoryMappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        // flowId={flowId}
      />
      <AddCategoryMappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        // flowId={flowId}
      />
      <VariationMappingDrawer
        integrationId={integrationId}
        storeId={storeId}
        sectionId={sectionId}
        // flowId={flowId}
      />

      <PanelHeader title={`${section.title} flows`}>
        {hasAdvancedSettings && (
          <IconTextButton
            variant="text"
            color="primary"
            data-test={`configure${section.title}`}
            component={Link}
            className={classes.configureSectionBtn}
            to={`${sectionId}/configure`}>
            <SettingsIcon /> Configure {section.title}
          </IconTextButton>
        )}
      </PanelHeader>
      {flows.map(f => (
        <FlowCard
          key={f._id}
          storeId={storeId}
          flowId={f._id}
          excludeActions={[
            'detach',
            'clone',
            'delete',
            'references',
            'download',
          ]}
        />
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
  if (match.isExact && flowSections && flowSections.length) {
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
