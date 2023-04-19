/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useCallback, useRef, useEffect } from 'react';
import { Divider, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import InfoIconButton from '../../../InfoIconButton';
import useScrollIntoView from '../../../../hooks/useScrollIntoView';
import useSyncedRef from '../../../../hooks/useSyncedRef';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75),
    width: '100%',
    '&:hover,&:focus': {
      backgroundColor: theme.palette.background.paper2,
      cursor: 'pointer',
    },
    color: 'black',
    backgroundColor: ({focussed}) => focussed ? theme.palette.background.paper2 : 'initial',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '18.125rem',
  },
  time: {
    minWidth: '10rem',
  },
  filler: {
    flexGrow: 1,
  },
  dataDivider: {
    height: theme.spacing(2),
    width: 1,
    margin: theme.spacing(0, 1),
  },
}));

function GenericRow({result, children, includeDivider, focussed, type}) {
  const classes = useStyles({focussed});
  const history = useHistory();
  const rowRef = useRef();

  useScrollIntoView(rowRef, focussed);

  const memoizedValuesRef = useSyncedRef({ history, result, type});
  const url = useSelector(state => selectors.getResourceEditUrl(state, type, result?._id));

  const handleRowClick = useCallback(() => {
    const {history, type} = memoizedValuesRef?.current;

    if (type === 'recycleBin') {
      return history.push('/recycleBin');
    }
    history.push(url);
  }, [memoizedValuesRef, url]);

  const handleKeyDown = useCallback(e => {
    // Listen to only enter key press

    /* When navigating with tab,
    pressing enter on focussed tab should not navigate to the resource
    But change the tab, hence checking if activeElement is not Tabs Button */
    if (e.keyCode === 13 && !document?.activeElement?.className?.includes('Button')) {
      // To stop event bubbling
      e?.stopPropagation();
      handleRowClick();
    }
  }, [handleRowClick]);

  /* For keyboard support, we are adding handlers explicitly
   Since this event should only be registered when resource results are displayed
   We explicitly add and remove the listeners in the effect
   This handler should be added only to the focussed element
   so that it listens only for focussed element  */

  useEffect(() => {
    window.addEventListener('keydown', focussed ? handleKeyDown : null);

    return () => window.removeEventListener('keydown', focussed ? handleKeyDown : null);
  }, [focussed, handleKeyDown]);

  if (!result) return null;

  const resultText = result.name || result._id || result.doc?.name || result?.doc?._id;
  const preventEventBubblingHandler = e => e.stopPropagation();

  return (
    <>
      {includeDivider && <Divider orientation="horizontal" />}
      <div
        tabIndex={0}
        ref={rowRef}
        className={classes.root}
        title={resultText}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}>
        <Typography className={classes.text} variant="body2">{resultText}</Typography>
        {result.description && (
        <div onClick={preventEventBubblingHandler}>
          <InfoIconButton tabIndex={-1} size="xs" info={result.description} title={resultText} />
        </div>
        )}

        {children && <Divider orientation="vertical" className={classes.dataDivider} />}
        {children}

        <div className={classes.filler} />
        <div className={classes.time}>
          <CeligoTimeAgo date={result.lastModified} />
        </div>
      </div>
    </>
  );
}

export default React.memo(GenericRow);
