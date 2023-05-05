import React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@celigo/fuse-ui';
import makeStyles from '@mui/styles/makeStyles';
import ActionGroup from '../ActionGroup';
import ConnectionsIcon from '../icons/ConnectionsIcon';
import FlowsIcon from '../icons/FlowsIcon';

const useStyles = makeStyles(theme => ({
  root: {
    '& span:hover': { backgroundColor: '#F9FAFF' },
    display: 'flex',
  },
  box: {
    height: 100,
    width: 350,
    display: 'flex',
    borderRadius: 7,
    // borderColor: '#8EC635',
  },
  boxBackground: {
    backgroundColor: 'white',
    color: 'black',
  },
  titleStatusPanel: {
    color: theme.palette.secondary.main,
    fontFamily: 'Roboto400',
    fontWeight: 'bold',
  },
  iconStyle: {
    width: 55,
    height: 55,
  },
  connections: {
    borderColor: '#8EC635',
    color: '#8EC635',
  },
  flows: {
    borderColor: '#9C3A99',
    color: '#9C3A99',
  },
}));

const MuiBox = ({ data, value }) => {
  const classes = useStyles();
  const number = data.length;

  // console.log(data);

  return (
    <div className={classes.root}>
      <Box
        component="span"
        data-testid="box"
        m={4} // margin
        p={4} // padding
        boxShadow={12}
        borderBottom={8}
        className={`${classes.box} ${classes.boxBackground} ${
          value === 'connections' ? classes.connections : classes.flows
        }`}
      >
        <ActionGroup position="left">
          <Typography
            variant="h1"
            className={classes.titleStatusPanel}
            data-testid="heading"
          >
            <Box> {number}</Box>
          </Typography>
          <Typography variant="subtitle2" data-testid="subheading">
            <Box>{value}</Box>
          </Typography>
        </ActionGroup>
        <ActionGroup position="right">
          {value === 'connections' ? (
            <ConnectionsIcon className={classes.iconStyle} />
          ) : (
            <FlowsIcon className={classes.iconStyle} />
          )}
        </ActionGroup>
      </Box>
    </div>
  );
};

export default MuiBox;
