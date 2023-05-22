import React, { useEffect, useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  NavLink,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { List, ListItem, Divider, Box, styled } from '@mui/material';
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
  listItem: {
    color: theme.palette.secondary.main,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(1),
}));

const StyledDivRoot = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.secondary.lightest,
  backgroundColor: theme.palette.background.paper,
}));

const StyledContent = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(0, 3, 3, 0),
  overflowX: 'auto',
  overflowY: 'visible',
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
        <StyledDivRoot sx={{ padding: theme => theme.spacing(1, 2) }}>
          <StyledContainer>
            <Typography variant="h4">
              Settings
            </Typography>
          </StyledContainer>
          <Divider
            sx={{
              marginRight: theme => theme.spacing(1),
              marginTop: '10px',
              marginBottom: '10px',
            }} />
          <StyledContent>
            <span>
              {isParentView
                ? getEmptyMessage(integration.settings?.storeLabel, 'view settings')
                : (
                  <Typography>
                    You don &apos;t have any custom settings for this integration.
                  </Typography>
                ) }
            </span>
          </StyledContent>
        </StyledDivRoot>
      );
    }
  }

  return (
    <StyledDivRoot>
      <StyledContainer>
        <Box
          sx={{
            minWidth: 200,
            borderRight: theme => `solid 1px ${theme.palette.secondary.lightest}`,
            paddingTop: theme => theme.spacing(2),
          }}>
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
        </Box>
        <StyledContent>
          <FlowSettingsPanel
            availableSections={availableSections}
            integrationId={integrationId}
            childId={childId}
            sectionProps={sectionProps}
          />
          <EditorDrawer />
        </StyledContent>
      </StyledContainer>
    </StyledDivRoot>
  );
}

