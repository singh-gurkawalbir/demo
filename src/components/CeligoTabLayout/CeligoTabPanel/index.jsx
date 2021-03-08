import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  tabPanel: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: -18,
  },
}));
export default function CeligoTabPanel(props) {
  const { children, value, panelId, ...other } = props;
  const classes = useStyles();

  return (
    <div hidden={value !== panelId} {...other} >
      {value === panelId && (<div className={classes.tabPanel}> {children} </div>) }
    </div>
  );
}

CeligoTabPanel.propTypes = {
  children: PropTypes.node,
  panelId: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
