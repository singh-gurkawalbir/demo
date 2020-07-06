import React, {useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useRouteMatch, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0, 0, 2),
    overflowX: 'auto',
  },
  transferButton: {
    margin: theme.spacing(1),
    textAlign: 'center',
    float: 'right',
  },
  wrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    maxWidth: '75%',
    backgroundColor: theme.palette.secondary.lightest,
  },
  linearProgressWrapper: {
    marginTop: theme.spacing(1),
  },
  itemsList: {
    marginTop: theme.spacing(1),
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    '& li': {
      float: 'left',
      paddingRight: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRight: `1px solid ${theme.palette.secondary.light}`,
      fontSize: 15,
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  subHeading: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  heading: {
    textAlign: 'left',
    marginBottom: theme.spacing(3),
  },
  bold: {
    fontWeight: 'bold',
  },
  normal: {
    fontWeight: 'normal',
  },
  block: {
    marginBottom: theme.spacing(3),
  },
  linkCompare: {
    marginLeft: theme.spacing(2),
  },
  headingMaster: {
    fontSize: theme.spacing(4),
    fontWeight: 'bold',
    textAlign: 'left',
    padding: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(2),
  },

  drawerPaper: {
    width: 600,
    padding: theme.spacing(1),
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  link: {
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(2),
  },

  footer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
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
