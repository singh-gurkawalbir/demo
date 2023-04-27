import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import InstallationGuideIcon from '../../../../../components/icons/InstallationGuideIcon';
import EnvironmentToggle from '../../../../../App/CeligoAppBar/EnvironmentToggle';

const useStyles = makeStyles(theme => ({
  formHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(0.5, 3),
  },
  guideLink: {
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function FormHeader({
  selectedAccountHasSandbox,
  helpURL,
  handleToggle,
}) {
  const classes = useStyles();

  return (
    <div className={classes.formHeader}>
      <h3>Set up connection</h3>
      {selectedAccountHasSandbox ? (
        <EnvironmentToggle handleToggle={handleToggle} />
      ) : (
        <div>
          <a
            className={classes.guideLink}
            href={helpURL}
            rel="noreferrer"
            target="_blank"
            >
            Shopify connection guide
            <InstallationGuideIcon className={classes.guideLinkIcon} />
          </a>
        </div>
      )}
    </div>
  );
}
