import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTabContext } from '../CeligoTabWrapper';

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
  const { children, panelId } = props;
  const classes = useStyles();
  const tabsContext = useTabContext();
  const {activeTab, height} = tabsContext;

  return (
    <div hidden={activeTab !== panelId} >
      {activeTab === panelId && (
      <div className={classes.tabPanel}>
        {cloneElement(children, { height })}
      </div>
      ) }
    </div>
  );
}

CeligoTabPanel.propTypes = {
  children: PropTypes.node,
  panelId: PropTypes.any.isRequired,
};
