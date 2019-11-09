import { Fragment, useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import ArrowPopper from '../../../../../components/ArrowPopper';
import TooltipContent from '../../../../../components/TooltipContent';
import InfoIcon from '../../../../../components/icons/InfoIcon';

// const useStyles = makeStyles(theme => ({
//   root: {
//     display: 'flex',
//     margin: theme.spacing(1),
//   },
// }));

export default function InfoIconButton({ info }) {
  // const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleInfoOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleInfoClose() {
    setAnchorEl(null);
  }

  if (!info || !info.length) {
    return null;
  }

  return (
    <Fragment>
      <IconButton
        data-test="openPageInfo"
        size="small"
        onClick={handleInfoOpen}
        aria-owns={!anchorEl ? null : 'pageInfo'}
        aria-haspopup="true">
        <InfoIcon />
      </IconButton>
      <ArrowPopper
        id="pageInfo"
        open={!!anchorEl}
        anchorEl={anchorEl}
        placement="right-start"
        onClose={handleInfoClose}>
        <TooltipContent>{info}</TooltipContent>
      </ArrowPopper>
    </Fragment>
  );
}
