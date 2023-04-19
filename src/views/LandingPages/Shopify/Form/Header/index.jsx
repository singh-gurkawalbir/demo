import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/material';
import InstallationGuideIcon from '../../../../../components/icons/InstallationGuideIcon';
import EnvironmentToggle from '../../../../../App/CeligoAppBar/EnvironmentToggle';

const useStyles = makeStyles(theme => ({
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
  },
  guideLink: {
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
}));

export default function FormHeader({
  selectedAccountHasSandbox,
  helpURL,
  handleToggle,
}) {
  const classes = useStyles();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: theme => `1px solid ${theme.palette.secondary.lightest}`,
        padding: theme => theme.spacing(0.5, 3),
      }}>
      <h3>Set up connection</h3>
      {selectedAccountHasSandbox ? (
        <EnvironmentToggle handleToggle={handleToggle} />
      ) : (
        <div>
          <a
            href={helpURL}
            className={classes.guideLink}
            rel="noreferrer"
            target="_blank"
            >
            Shopify connection guide
            <InstallationGuideIcon className={classes.guideLinkIcon} />
          </a>
        </div>
      )}
    </Box>
  );
}
