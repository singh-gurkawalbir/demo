import React from 'react';
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
import CeligoDivider from '../../../components/CeligoDivider';
import TilesViewIcon from '../../../components/icons/TilesViewIcon';
import ListViewIcon from '../../../components/icons/ListViewIcon';
import IconButtonWithTooltip from '../../../components/IconButtonWithTooltip';
import KeywordSearch from '../../../components/KeywordSearch';
import actions from '../../../actions';
import { FILTER_KEY, LIST_VIEW, TILE_VIEW } from '../util';

const useStyles = makeStyles(theme => ({
  viewIcon: {
    color: theme.palette.secondary.main,
    '&:hover': {
      background: 'none',
      color: theme.palette.primary.main,
    },
  },
}));

export default function IntegrationCeligoPageBar() {
  const location = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const permission = useSelector(state => {
    const {create, install} = selectors.resourcePermissions(state, 'integrations');

    return {create, install};
  }, shallowEqual);
  const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard, shallowEqual);

  return (
    <CeligoPageBar title="My integrations">
      <KeywordSearch isHomeSearch filterKey={FILTER_KEY} />

      <ActionGroup>
        {permission.create && (
        <TextButton
          data-test="newIntegration"
          component={Link}
          startIcon={<AddIcon />}
          to={`${location.pathname}/add/integrations/${generateNewId()}`}
          >
          Create integration
        </TextButton>
        )}
        {permission.install && (
        <TextButton
          data-test="installZip"
          component={Link}
          startIcon={<ZipUpIcon />}
          to={`${location.pathname}/installIntegration`}
          >
          Install integration
        </TextButton>
        )}

        <CeligoDivider position="right" />
        {/* todo: ashu based on current view, place blue underline on icon */}
        <IconButtonWithTooltip
          data-test="tileView"
          className={classes.viewIcon}
          onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: TILE_VIEW}}))}
          tooltipProps={{title: 'Tile view', placement: 'bottom'}}
          buttonSize={{size: 'small'}}>
          <TilesViewIcon />
        </IconButtonWithTooltip>

        <IconButtonWithTooltip
          data-test="listView"
          className={classes.viewIcon}
          onClick={() => dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, view: LIST_VIEW} }))}
          tooltipProps={{title: 'List view', placement: 'bottom'}}
          buttonSize={{size: 'small'}}>
          <ListViewIcon />
        </IconButtonWithTooltip>
      </ActionGroup>
    </CeligoPageBar>
  );
}
