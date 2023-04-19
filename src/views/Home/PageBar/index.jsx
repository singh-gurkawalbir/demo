import React from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../reducers';
import CeligoPageBar from '../../../components/CeligoPageBar';
import AddIcon from '../../../components/icons/AddIcon';
import ZipUpIcon from '../../../components/icons/InstallIntegrationIcon';
import { generateNewId } from '../../../utils/resource';
import TextButton from '../../../components/Buttons/TextButton';
import ActionGroup from '../../../components/ActionGroup';
// import CeligoDivider from '../../../components/CeligoDivider';
import TilesViewIcon from '../../../components/icons/TilesViewIcon';
import ListViewIcon from '../../../components/icons/ListViewIcon';
import IconButtonWithTooltip from '../../../components/IconButtonWithTooltip';
import KeywordSearch from '../../../components/KeywordSearch';
import actions from '../../../actions';
import { FILTER_KEY, LIST_VIEW, TILE_VIEW } from '../../../utils/home';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  viewsWrapper: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: parseInt(theme.spacing(3), 10),
  },
}));

const StyledIconButtonWithTooltip = styled(IconButtonWithTooltip, {
  shouldForwardProp: prop => prop !== 'active',
})(({ theme, active }) => ({
  position: 'relative',
  marginLeft: theme.spacing(2),
  color: theme.palette.secondary.main,
  '&:hover': {
    background: 'none',
    color: theme.palette.primary.main,
  },
  '&:last-child': {
    marginLeft: -parseInt(theme.spacing(0.5), 10),
  },
  ...(active && {
    color: theme.palette.primary.main,
    '&:after': {
      position: 'absolute',
      content: '""',
      width: '100%',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
      bottom: -parseInt(theme.spacing(0.5), 10),
      left: 0,
    },
  }),
}));

const emptyObject = {};
export default function IntegrationCeligoPageBar() {
  const location = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const permission = useSelector(state => {
    const {create, install} = selectors.resourcePermissions(state, 'integrations');

    return {create, install};
  }, shallowEqual);
  const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard || emptyObject, shallowEqual);
  const isListView = useSelector(state => selectors.isHomeListView(state));

  return (
    <CeligoPageBar title="My integrations">
      <KeywordSearch
        placeholder="Search integrations & flows"
        size="large"
        filterKey={FILTER_KEY}
        sx={{
          height: 38,
          marginRight: theme => theme.spacing(1),
        }}
      />

      <ActionGroup>
        {permission.create && (
          <>
            <TextButton
              data-test="createFlow"
              component={Link}
              startIcon={<AddIcon />}
              to="/integrations/none/flowBuilder/new"
              >
              Create flow
            </TextButton>
            <TextButton
              data-test="newIntegration"
              component={Link}
              startIcon={<AddIcon />}
              to={buildDrawerUrl({
                path: drawerPaths.RESOURCE.ADD,
                baseUrl: location.pathname,
                params: { resourceType: 'integrations', id: generateNewId() },
              })} >
              Create integration
            </TextButton>
          </>
        )}
        {permission.install && (
        <TextButton
          data-test="installZip"
          component={Link}
          startIcon={<ZipUpIcon />}
          to={buildDrawerUrl({
            path: drawerPaths.INSTALL.INTEGRATION,
            baseUrl: location.pathname,
          })} >
          Install integration
        </TextButton>
        )}
        <ActionGroup className={classes.viewsWrapper}>
          <StyledIconButtonWithTooltip
            data-test="tileView"
            active={!isListView}
            onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: TILE_VIEW}}))}
            tooltipProps={{title: 'Tile view', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <TilesViewIcon />
          </StyledIconButtonWithTooltip>

          <StyledIconButtonWithTooltip
            data-test="listView"
            active={isListView}
            onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: LIST_VIEW} }))}
            tooltipProps={{title: 'List view', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <ListViewIcon />
          </StyledIconButtonWithTooltip>
        </ActionGroup>
      </ActionGroup>
    </CeligoPageBar>
  );
}
