import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { List, ListItem } from '@material-ui/core';
import { connectorsList } from '../../../../../constants/applications';
import ApplicationImg from '../../../../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  list: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    backgroundColor: 'rgb(255,255,255,0.1)',
    paddingTop: 0,
    paddingBottom: 0,
    '& ul': {
      '&:last-child': {
        borderBottom: `solid 1px ${theme.palette.secondary.dark}`,
      },
    },
  },
  img: {
    maxWidth: '100%',
    padding: '0px 16px',
  },
  optionImg: {
    width: '120px',
    display: 'flex',
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
    color: theme.palette.divider,
    height: '100%',
  },
}));

export default function ApplicationImgCell({ applications }) {
  const classes = useStyles();
  const connectors = connectorsList();

  const apps = applications.slice(0, 4).map(application => {
    const { value, type, icon} = connectors.find(connector => connector.value === application);

    return (
      <ListItem key={value}>
        <span className={classes.optionImg}>
          <ApplicationImg
            markOnly
            type={type === 'webhook' ? value : type}
            assistant={icon}
            className={classes.img}
          />
        </span>
      </ListItem>
    );
  });

  return (
    <List className={classes.list}>
      {apps}
    </List>
  );
}
