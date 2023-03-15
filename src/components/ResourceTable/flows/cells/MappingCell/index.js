import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import MapDataIcon from '../../../../icons/MapDataIcon';
import { selectors } from '../../../../../reducers';
import RemoveMargin from '../RemoveMargin';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  circle: {
    position: 'relative',
    '& .MuiButtonBase-root': {
      '&:before': {
        content: '""',
        height: theme.spacing(1),
        width: theme.spacing(1),
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        position: 'absolute',
        top: theme.spacing(1.6),
        right: theme.spacing(0.9),
        display: 'block',
        zIndex: 1,
      },
    },
  },
}));

export default function MappingCell({ flowId, childId }) {
  const history = useHistory();
  const classes = useStyles();
  const showMapping = useSelector(state =>
    selectors.flowSupportsMapping(state, flowId, childId)
  );
  const isMappingExist = useSelector(state =>
    selectors.flowHasMappings(state, flowId)
  );

  const showUtilityMapping = useSelector(state =>
    selectors.flowUsesUtilityMapping(state, flowId, childId)
  );
  const handleClick = useCallback(() => {
    if (showUtilityMapping) {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.CATEGORY_MAPPING.ROOT,
        baseUrl: history.location.pathname,
        params: { flowId, categoryId: 'commonAttributes' },
      }));
    } else {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.IMPORT.LIST_ALL,
        baseUrl: history.location.pathname,
        params: { flowId },
      }));
    }
  }, [history, showUtilityMapping, flowId]);

  if (!showMapping) return null;

  return (
    <RemoveMargin>
      <div className={clsx(isMappingExist && classes.circle)}>
        <IconButtonWithTooltip
          tooltipProps={{title: `${isMappingExist ? 'Edit' : 'Add'} mapping`, placement: 'bottom'}}
          onClick={handleClick}>
          <MapDataIcon color="secondary" />
        </IconButtonWithTooltip>
      </div>
    </RemoveMargin>
  );
}
