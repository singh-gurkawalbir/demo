import { Fragment, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Icon from '../../../../components/icons/StacksIcon';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';
import getRoutePath from '../../../../utils/routePaths';

export default {
  key: 'stackShares',
  component: function StackShares({ resource }) {
    const history = useHistory();
    const openShareStackURL = useCallback(() => {
      history.push(getRoutePath(`/stacks/${resource._id}/share`));
    }, [history, resource._id]);
    const showStackShare = useCallback(() => {
      openShareStackURL();
    }, [openShareStackURL]);

    return (
      <Fragment>
        <IconButtonWithTooltip
          tooltipProps={{
            title: 'Stack shares',
          }}
          data-test="showStackShares"
          size="small"
          onClick={showStackShare}>
          <Icon />
        </IconButtonWithTooltip>
      </Fragment>
    );
  },
};
