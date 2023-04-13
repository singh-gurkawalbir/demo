import { Divider, List, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import {
  NavLink,
  Redirect, Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../../actions';
import PanelHeader from '../../../../../../components/PanelHeader';
import { selectors } from '../../../../../../reducers';
import inferErrorMessages from '../../../../../../utils/inferErrorMessages';
import ConfigureSettings from './sections/ConfigureSettings';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';

export const LoadSettingsMetadata = ({ssLinkedConnectionId,
  integrationId, children }) => {
  const dispatch = useDispatch();

  const {hasData: hasSettingsMetadata, isLoading} = useSelector(state => selectors.suiteScriptResourceStatus(state, {
    ssLinkedConnectionId,
    integrationId,
    resourceType: 'settings',
  }), shallowEqual);

  const resource = useSelector(state => selectors.suiteScriptResource(state, {
    ssLinkedConnectionId,
    id: integrationId,
    resourceType: 'settings',
  }));

  useEffect(() => {
    // if settings is of type string during opening of tile...quiet likely there was an error before
    // could be due to connection failure so we fetch settings once again
    if (!hasSettingsMetadata || (typeof resource === 'string')) {
      dispatch(actions.suiteScript.resource.request('settings', ssLinkedConnectionId, integrationId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasSettingsMetadata || isLoading) { return <Spinner center="screen" />; }

  // if settings is of type string...quiet likely its an error
  if (typeof resource === 'string' || resource?.errors) {
    return <Typography color="error">{inferErrorMessages(resource)[0]}</Typography>;
  }

  return children;
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
    overflowX: 'auto',
  },
  listItem: {
    color: theme.palette.secondary.main,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  divider: {
    marginRight: theme.spacing(1),
    marginTop: '10px',
    marginBottom: '10px',
  },
}));

function SettingsPanelComponent({
  integrationId,
  ssLinkedConnectionId,
  ...sectionProps
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const {integrationAppName} = match?.params;

  const allSections = useSelectorMemo(selectors.makeSuiteScriptIASections, integrationId, ssLinkedConnectionId);

  const availableSections = useMemo(() => allSections.reduce((newArray, s) => {
    if (!!s.fields || !!s.sections?.length) {
      newArray.push({
        path: s.titleId,
        label: s.title,
        Section: 'FlowsConfiguration',
        id: s.id,
      });
    }

    return newArray;
  }, []), [allSections]);

  // if someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because some users have different sets of available
  // sections.
  if (match.isExact) {
    // no section provided.
    if (availableSections.length === 0) {
      return (
        <div className={classes.root}>
          <div className={classes.container}>
            <Typography variant="h4">
              Settings
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.content}>
            <span>
              You don&apos;t have any custom settings for this integration.
            </span>
          </div>
        </div>
      );
    }

    return (
      <Redirect push={false} to={`${match.url}/${availableSections[0].path}`} />
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.subNav}>
          <List>
            {availableSections.map(({ path, label, id }) => (
              <ListItem key={path}>
                <NavLink
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={path}
                  data-test={id}>
                  {label}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </div>
        <div className={classes.content}>
          <Switch>
            {availableSections.map(({ path, Section, label, id }) => (
              <Route key={path} path={`${match.url}/${path}`}>
                {Section === 'FlowsConfiguration' ? (
                  <>
                    <PanelHeader title={`Configure all ${label} flows`} />
                    <ConfigureSettings
                      integrationAppName={integrationAppName}
                      integrationId={integrationId}
                      ssLinkedConnectionId={ssLinkedConnectionId}
                      sectionId={path}
                      id={id}
                      />
                  </>
                ) : (
                  <Section
                    integrationAppName={integrationAppName}
                    integrationId={integrationId}
                    ssLinkedConnectionId={ssLinkedConnectionId}
                    sectionId={path}
                    id={id}
                    {...sectionProps}
                />
                )}

              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPanel({ ssLinkedConnectionId, integrationId }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="Integration flows" />
      <LoadSettingsMetadata
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId} >
        <SettingsPanelComponent
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}

          />
      </LoadSettingsMetadata>

    </div>
  );
}
