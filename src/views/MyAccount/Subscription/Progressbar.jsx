import React, {useCallback} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { LinearProgress, Typography} from '@mui/material';
import { useRouteMatch, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { TextButton } from '../../../components/Buttons';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  featureText: {
    fontSize: 15,
    lineHeight: '22px',
  },
  featureTextDisabled: {
    color: theme.palette.secondary.contrastText,
  },
  progressBar: {
    height: theme.spacing(2),
    borderRadius: 10,
    maxWidth: '75%',
    backgroundColor: theme.palette.secondary.lightest,
  },
  productionUsageWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  productionUsageInfo: {
    width: 200,
    wordBreak: 'break-word',
  },
  productionProgressBar: {
    minWidth: 560,
    marginRight: theme.spacing(2),
  },
}));

export default function ProgressBar({ usedCount, totalCount, env, type, setTitle, hideButton}) {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const titleMap = {
    endpoints: 'Endpoint apps:',
    flows: 'Integration flows:',
    tradingpartners: 'Trading partners:',
    agents: 'On-premise agents:',
  };
  const onButtonClick = useCallback(
    () => {
      history.replace(buildDrawerUrl({
        path: drawerPaths.ACCOUNT.SUBSCRIPTION,
        baseUrl: match.url,
        params: { env, type },
      }));
      setTitle(type);
    }, [history, match, env, type, setTitle]);

  return (
    <div className={classes.productionUsageWrapper}>
      <div className={classes.productionUsageInfo}>
        <Typography variant="h4" component="span" className={classes.featureText}>
          {titleMap[type] || 'Using '}&nbsp;
        </Typography>
        <Typography component="span"><span>{usedCount} </span>of <span>{totalCount}</span></Typography>
      </div>
      <div className={classes.productionUsageLinearProgress}>
        <LinearProgress
          color="primary"
          value={(usedCount / totalCount) * 100}
          variant="determinate"
          thickness={10}
          className={clsx(classes.progressBar, classes.productionProgressBar)}
          />
      </div>
      {!hideButton && (
      <TextButton
        disabled={usedCount === 0}
        data-test="fixConnection"
        onClick={onButtonClick}>
        List
      </TextButton>
      )}
    </div>
  );
}
