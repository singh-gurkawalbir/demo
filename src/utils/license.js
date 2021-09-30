import moment from 'moment';
import integrationAppUtil from './integrationApps';

export function upgradeStatus(license, integration = {}) {
  if (
    !license ||
    !license.opts ||
    !license.opts.connectorEdition ||
    !integration.settings
  ) {
    return '';
  }

  if (
    (integration.settings.connectorEdition || '').toLowerCase() === 'custom fba'
  ) {
    return '';
  }

  const highestEditionForConnector = integrationAppUtil.getHighestEditionForIntegrationApp(
    integration
  );

  const editionArray = [
    'starter',
    'standard',
    'premium',
    'enterprise',
    'custom fba',
  ];
  const connectorEdition = editionArray.indexOf(
    license.opts &&
      license.opts.connectorEdition &&
      license.opts.connectorEdition.toLowerCase()
  );
  const highestEdition = editionArray.indexOf(highestEditionForConnector);
  const presentEdition = editionArray.indexOf(
    integration.settings &&
      integration.settings.connectorEdition &&
      integration.settings.connectorEdition.toLowerCase()
  );

  if (presentEdition === highestEdition) {
    return '';
  }
  if (
    presentEdition === connectorEdition &&
    presentEdition < highestEdition
  ) {
    return 'requestUpgrade';
  }
  if (presentEdition < connectorEdition) {
    return 'upgrade';
  }

  return '';
}

export function upgradeButtonText(license, integration = {}, upgradeRequested) {
  if (upgradeRequested) {
    return 'UPGRADE REQUESTED';
  }

  const value = upgradeStatus(license, integration);

  if (value === 'upgrade') {
    return 'UPGRADE';
  }
  if (value === 'requestUpgrade') {
    return 'CONTACT US TO UPGRADE';
  }

  return '';
}

export function expiresInfo(license) {
  const { expires } = license || {};
  const hasExpired = moment(expires) - moment() < 0;
  let expiresText = '';
  const dtExpires = moment(expires);

  if (expires) {
    if (hasExpired) {
      expiresText = `Expired on ${dtExpires.format('MMM Do, YYYY')}`;
    } else {
      expiresText = `Expires on ${dtExpires.format('MMM Do, YYYY')}`;
      const dtEoDToday = moment().endOf('day');

      if (dtExpires.diff(dtEoDToday, 'seconds') <= 0) {
        expiresText += ' (Today)';
      } else {
        let days = dtExpires.diff(dtEoDToday, 'days');
        const hours = dtExpires.diff(dtEoDToday, 'hours', true) % 24;

        if (hours > 0) {
          days += 1;
        }

        if (days === 1) {
          expiresText += ' (Tomorrow)';
        } else if (days <= 30) {
          expiresText += ` (${days} Days)`;
        }
      }
    }
  }

  return expiresText;
}

export function platformLicenseActionDetails(license) {
  let licenseActionDetails = {};

  if (!license) {
    return licenseActionDetails;
  }
  const expiresInDays = Math.ceil((moment(license.expires) - moment()) / 1000 / 60 / 60 / 24);

  if (license.resumable) {
    licenseActionDetails = {
      action: 'resume',
    };
  } else if (license.expires && expiresInDays <= 0) {
    licenseActionDetails = {
      action: 'expired',
    };
  } else if (license.tier === 'none') {
    if (!license.trialEndDate) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'Get unlimited flows',
      };
    }
  } else if (license.tier === 'free') {
    if (license.status === 'TRIAL_EXPIRED') {
      licenseActionDetails = {
        action: 'upgrade',
        label: 'UPGRADE NOW',
      };
    } else if (license.status === 'IN_TRIAL') {
      if (license.expiresInDays < 1) {
        licenseActionDetails = {
          action: 'upgrade',
          label: 'UPGRADE NOW',
        };
      } else {
        licenseActionDetails = {
          action: 'upgrade',
          label: 'Upgrade now -',
          daysLeft: `${license.expiresInDays} days left`,
        };
        licenseActionDetails.expiresSoon = license.expiresInDays < 10;
      }
    } else if (license.type === 'endpoint' && !license.trialEndDate) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'Get unlimited flows',
      };
    } else if (!license.trialEndDate && !license.expires) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'Get unlimited flows',
      };
    }
  }

  licenseActionDetails.upgradeRequested = license.upgradeRequested;

  return licenseActionDetails;
}
