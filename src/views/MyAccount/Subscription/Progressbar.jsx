import React, {useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useRouteMatch, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  progressBar: {
    height: 10,
    borderRadius: 10,
    maxWidth: '75%',
    backgroundColor: theme.palette.secondary.lightest,
  }
}));

export default function ProgressBar({ usedCount, totalCount, env, type, setTitle}) {
  const match = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const titleMap = {
    endpoints: 'Endpoint apps',
    flows: 'Integration flows',
    tradingpartners: 'Trading partners',
    agents: 'On-premise agents',
  };
  const onButtonClick = useCallback(
    () => {
      history.replace(`${match.url}/${env}/${type}`);
      setTitle(type);
    }, [history, match, env, type, setTitle]);

  return (
    <div>
      <div>{titleMap[type]} {usedCount} of {totalCount}</div>
      <LinearProgress
        color="primary"
        value={(usedCount / totalCount) * 100}
        variant="determinate"
        thickness={10}
        className={classes.progressBar}
      />
      <Button
        onClick={onButtonClick}
        variant="outlined"
        color="primary">
        List!
      </Button>
    </div>);
}
