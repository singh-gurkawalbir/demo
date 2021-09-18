import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Divider, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import UpArrowIcon from '../../../../../../components/icons/ArrowUpIcon';
import FilledButton from '../../../../../../components/Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  rootExpanded: {
    margin: `${theme.spacing(0, 0, 2)} !important`,
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

export default function Generic({type, result, includeDivider}) {
  const classes = useStyles();
  const history = useHistory();

  if (!result) return null;

  const handleClick = () => history.push(result.url);
  const buttonLabel = type === 'marketplaceConnectors' ? 'Request a demo' : 'Preview';

  return (
    <>
      {includeDivider && <Divider orientation="horizontal" />}

      <Accordion elevation={0} classes={{expanded: classes.rootExpanded}}>
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
    </>
  );
}
