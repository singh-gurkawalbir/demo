import React, { useCallback } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { FilledButton } from '@celigo/fuse-ui';
import DownArrowIcon from '../../../icons/ArrowDownIcon';
import useRequestForDemo from '../../../../hooks/useRequestForDemo';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { useGlobalSearchState } from '../../GlobalSearchContext/createGlobalSearchState';
import getRoutePath from '../../../../utils/routePaths';

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
}));

function MarketPlaceRow({type, result, includeDivider}) {
  const classes = useStyles();
  const setOpen = useGlobalSearchState(state => state.changeOpen);
  const history = useHistory();
  const {RequestDemoDialog, requestDemo} = useRequestForDemo();

  const handleClick = useCallback(e => {
    e?.stopPropagation();
    if (type === 'marketplaceTemplates') {
      const url = buildDrawerUrl({
        path: drawerPaths.INSTALL.TEMPLATE_PREVIEW,
        baseUrl: getRoutePath(`marketplace/${result?.applications?.[0]}`),
        params: { templateId: result?._id },
      });

      setOpen(false);
      history.push(url);
    } else {
      requestDemo(result);
    }
  }, [history, requestDemo, result, setOpen, type]);
  const buttonLabel = type === 'marketplaceConnectors' ? 'Request demo' : 'Preview';

  if (!result) return null;

  return (
    <>
      {includeDivider && <Divider orientation="horizontal" />}

      <Accordion
        elevation={0}
        classes={{expanded: classes.rootExpanded, root: classes.root}}>
        <AccordionSummary
          classes={{root: classes.summary}}
          expandIcon={<DownArrowIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={classes.summary}>
            <Typography variant="body2">{result.name}</Typography>
            <FilledButton size="small" sx={{whiteSpace: 'nowrap'}} onClick={handleClick}>{buttonLabel}</FilledButton>
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

export default MarketPlaceRow;
