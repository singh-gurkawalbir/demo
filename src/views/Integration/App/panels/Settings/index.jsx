import React, { useEffect, useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  NavLink,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { List, ListItem, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import { selectors } from '../../../../../reducers';
import GeneralSection from './sections/General';
import ConfigureSettings from './sections/ConfigureSettings';
import PanelHeader from '../../../../../components/PanelHeader';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { getEmptyMessage, isParentViewSelected } from '../../../../../utils/integrationApps';
import flowgroupingsRedirectTo from '../../../../../utils/flowgroupingsRedirectTo';
import EditorDrawer from '../../../../../components/AFE/Drawer';
import IsLoggableContextProvider from '../../../../../components/IsLoggableContextProvider';

const useStyles = makeStyles(theme => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    paddingTop: theme.spacing(1),
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
    overflowY: 'visible',
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
  emptyMessageWrapper: {
    padding: theme.spacing(1, 2),
  },
}));

function FlowSettingsPanel({availableSections, integrationId, childId, sectionProps}) {
  const match = useRouteMatch();

  const {sectionId} = match.params;

  if (!sectionId || !availableSections) { return null; }
  const sectionPanelProps = availableSections.find(({path}) => sectionId === path);

  if (!sectionPanelProps) return null;
  const { path, Section, label } = sectionPanelProps;

  if (Section === 'FlowsConfiguration') {
    return (
      <>
        <PanelHeader title={`Configure all ${label} flows`} />
        <ConfigureSettings
          integrationId={integrationId}
          childId={childId}
          sectionId={path}
              />
      </>
    );
  }

  return (
    <IsLoggableContextProvider isLoggable>
      <Section
        integrationId={integrationId}
        childId={childId}
        {...sectionProps}
          />
    </IsLoggableContextProvider>
  );
}

export default function SettingsPanel({
  integrationId,
  childId,
  ...sectionProps
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId) || {};
  const isParentView = isParentViewSelected(integration, childId);
  const hideGeneralTab = useSelector(
    state => !selectors.hasGeneralSettings(state, integrationId, childId)
  );

  const sections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);

  const filterTabs = useMemo(() => hideGeneralTab ? ['common'] : [], [hideGeneralTab]);
  const availableSections = useMemo(() => {
    const flowSections = sections.reduce((newArray, s) => {
      if (!!s.fields || !!s.sections) {
        newArray.push({
          path: s.titleId,
          label: s.title,
          Section: 'FlowsConfiguration',
          id: s.titleId,
        });
      }

      return newArray;
    }, []);

    const allSections = [{
      path: 'common',
      label: 'General',
      Section: GeneralSection,
      id: 'common',
    },
    ...flowSections];

    return allSections.filter(sec =>
      !filterTabs.includes(sec.id)
    );
  }, [filterTabs, sections]);

  useEffect(() => {
    if (match.isExact && availableSections && availableSections.length) {
      const redirectTo = flowgroupingsRedirectTo(match, availableSections.map(({id}) => ({sectionId: id})), availableSections[0].id);

      if (redirectTo) { history.replace(redirectTo); }
    }
  }, [availableSections, history, match]);
  // if someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because some users have different sets of available
  // sections.
  if (match.isExact) {
    // no section provided.
    if (availableSections.length === 0 || isParentView) {
      return (
        <div className={clsx(classes.root, classes.emptyMessageWrapper)}>
          <div className={classes.container}>
            <Typography variant="h4">
              Settings
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.content}>
            <span>
              {isParentView
                ? getEmptyMessage(integration.settings?.storeLabel, 'view settings')
                : (
                  <Typography>
                    You don &apos;t have any custom settings for this integration.
                  </Typography>
                ) }
            </span>
          </div>
        </div>
      );
    }
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
                  data-test={id}
                  >
                  {label}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </div>
        <div className={classes.content}>
          <FlowSettingsPanel
            availableSections={availableSections}
            integrationId={integrationId}
            childId={childId}
            sectionProps={sectionProps}
          />
          <EditorDrawer />
        </div>
      </div>
    </div>
  );
}

