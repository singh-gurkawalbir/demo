import React, { useRef, useCallback } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Divider, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import UpArrowIcon from '../../../../../../components/icons/ArrowUpIcon';
import FilledButton from '../../../../../../components/Buttons/FilledButton';
import useScrollIntoView from '../../hooks/useScrollIntoView';
import { useGlobalSearchState } from '../../hooks/useGlobalSearchState';
import useRequestForDemo from '../../../../../../hooks/useRequestForDemo';

const useStyles = makeStyles(theme => ({
  rootExpanded: {
    margin: `${theme.spacing(0, 0, 2)} !important`,
  },
  root: {
    backgroundColor: ({focussed}) => focussed ? theme.palette.background.paper2 : 'initial',
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: 0,
  },
  details: {
    border: 0,
    paddingTop: 0,
    paddingLeft: 28,
  },
  divider: {
    height: theme.spacing(2),
    width: 1,
    margin: theme.spacing(0, 1),
  },
  button: {
    whiteSpace: 'nowrap',
  },
}));

function MarketPlaceRow({type, result, includeDivider, focussed}) {
  const classes = useStyles({focussed});
  const setOpen = useGlobalSearchState(state => state.changeOpen);
  const history = useHistory();
  const rowRef = useRef();
  const {RequestDemoDialog, requestDemo} = useRequestForDemo();

  useScrollIntoView(rowRef, focussed);

  const handleClick = useCallback(e => {
    e?.stopPropagation();
    if (type === 'marketplaceTemplates') {
      const url = `/marketplace/${result?.applications?.[0]}/installTemplate/preview/${result?._id}`;

      setOpen(false);
      history.push(url);
    } else {
      requestDemo(result);
    }
  }, [history, requestDemo, result, setOpen, type]);
  const buttonLabel = type === 'marketplaceConnectors' ? 'Request a demo' : 'Preview';

  if (!result) return null;

  return (
    <>
      {includeDivider && <Divider orientation="horizontal" />}

      <Accordion
        ref={rowRef} elevation={0}
        classes={{expanded: classes.rootExpanded, root: classes.root}}>
        <AccordionSummary
          classes={{root: classes.summary}}
          expandIcon={<UpArrowIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={classes.summary}>
            <Typography variant="body2">{result.name}</Typography>
            <FilledButton size="small" className={classes.button} onClick={handleClick}>{buttonLabel}</FilledButton>
          </div>
        </AccordionSummary>
        <AccordionDetails
          classes={{root: classes.details}}
>
          <Typography variant="body2">
            {result.description || 'No description available'}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <RequestDemoDialog />
    </>
  );
}

const MemoizedMarketPlaceRow = React.memo(MarketPlaceRow);
export default MemoizedMarketPlaceRow;
