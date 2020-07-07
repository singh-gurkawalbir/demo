import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import AppBlock from '../AppBlock';
import * as selectors from '../../../../reducers';

/* TODO: the 'block' const in this file and <AppBlock> should eventually go in the theme.
   We use the block const across several components and thus is a maintenance issue to
   manage as we enhance the FB layout. */
const blockHeight = 170;
const lineHeightOffset = 63;
const lineWidth = 130;
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: theme.spacing(3),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: lineWidth,
    marginTop: 0,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    marginTop: -161,
    height: blockHeight + lineHeightOffset,
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({ history, match }) => {
  const { flowId, ssLinkedConnectionId } = match.params;
  const classes = useStyles();
  const resource = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: flowId,
      ssLinkedConnectionId,
    })
  );
  const handleBlockClick = useCallback(() => {
    const to = `${match.url}/edit/exports/${flowId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }, [flowId, history, match.isExact, match.url]);

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        blockType="export"
        onBlockClick={handleBlockClick}
        resource={resource}
      />
      <div
        /* -- connecting line */
        className={clsx([classes.line])}
      />
    </div>
  );
};

export default withRouter(PageGenerator);
