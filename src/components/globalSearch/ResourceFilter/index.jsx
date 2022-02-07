import React, { useMemo, useRef, useState } from 'react';
import { makeStyles,
  IconButton,
  Typography,
  Button,
  Divider,
} from '@material-ui/core';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../icons/ArrowUpIcon';
import FloatingPaper from './FloatingPaper';
import CloseIcon from '../../icons/CloseIcon';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import { getResourceFilters } from '../utils';
import MenuItem from './MenuItem';
import FilterLabel from './FilterLabel';

const useStyles = makeStyles(theme => ({
  arrowContainer: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: 24,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.palette.secondary.lightest,
    border: `1px solid ${theme.palette.secondary.contrastText}`,
  },
  menu: {
    padding: theme.spacing(1, 1, 1, 2),
    marginLeft: -87,
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  allContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeButton: {
    padding: theme.spacing(0.5),
  },
  marketplaceTitle: {
    marginTop: theme.spacing(2),
  },
}));

function ResourceFilter() {
  const classes = useStyles();
  const { filterBlacklist = [] } = useGlobalSearchContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  const handleArrowClick = () => setOpen(o => !o);
  const {resourceFilters, marketplaceFilters} = useMemo(() => getResourceFilters(filterBlacklist), [filterBlacklist]);

  return (
    <div>
      <div className={classes.arrowContainer}>
        <Button
          disableRipple
          className={classes.typeButton}
          onClick={handleArrowClick}
          endIcon={open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        >
          <FilterLabel />
        </Button>
      </div>

      {open && (
        <FloatingPaper ref={containerRef} className={classes.menu}>
          <div className={classes.allContainer}>
            <MenuItem resourceURL="all" type="all" label="All" />
            <IconButton size="small" onClick={handleArrowClick}>
              <CloseIcon />
            </IconButton>
          </div>

          <Divider orientation="horizontal" className={classes.divider} />
          <Typography variant="subtitle2" gutterBottom component="div">RESOURCES</Typography>
          {resourceFilters.map(filter => <MenuItem key={filter.type} type={filter.type} label={filter.label} resourceURL={filter?.resourceURL} />)}
          <Typography variant="subtitle2" className={classes.marketplaceTitle} gutterBottom component="div">MARKETPLACE</Typography>
          {marketplaceFilters.map(filter => <MenuItem key={filter.type} type={filter.type} label={filter.label} resourceURL={filter?.resourceURL} />)}
        </FloatingPaper>
      )}
    </div>
  );
}
export default React.memo(ResourceFilter);
