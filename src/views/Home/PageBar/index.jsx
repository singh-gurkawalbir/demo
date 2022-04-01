import React from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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
import { resourceUrl, DRAWER_URL_PREFIX } from '../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  viewIcon: {
    position: 'relative',
    marginLeft: theme.spacing(2),
    color: theme.palette.secondary.main,
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
    '&:last-child': {
      marginLeft: -theme.spacing(0.5),
    },
  },
  viewsWrapper: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: theme.spacing(3),
  },
  activeView: {
    color: theme.palette.primary.main,
    '&:after': {
      position: 'absolute',
      content: '""',
      width: '100%',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
      bottom: -theme.spacing(0.5),
      left: 0,
    },
  },
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
      <KeywordSearch isHomeSearch filterKey={FILTER_KEY} />

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
              to={`${location.pathname}${resourceUrl('add', 'integrations', generateNewId())}`}
              >
              Create integration
            </TextButton>
          </>
        )}
        {permission.install && (
        <TextButton
          data-test="installZip"
          component={Link}
          startIcon={<ZipUpIcon />}
          to={`${location.pathname}/${DRAWER_URL_PREFIX}/installIntegration`}
          >
          Install integration
        </TextButton>
        )}
        <ActionGroup className={classes.viewsWrapper}>
          <IconButtonWithTooltip
            data-test="tileView"
            className={clsx(classes.viewIcon, {[classes.activeView]: !isListView})}
            onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: TILE_VIEW}}))}
            tooltipProps={{title: 'Tile view', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <TilesViewIcon />
          </IconButtonWithTooltip>

          <IconButtonWithTooltip
            data-test="listView"
            className={clsx(classes.viewIcon, {[classes.activeView]: isListView})}
            onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: LIST_VIEW} }))}
            tooltipProps={{title: 'List view', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <ListViewIcon />
          </IconButtonWithTooltip>
        </ActionGroup>
      </ActionGroup>
    </CeligoPageBar>
  );
}
