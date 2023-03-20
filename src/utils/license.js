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
    'shopifymarkets',
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

export function upgradeButtonText(license, integration = {}, upgradeRequested, editions, isTwoDotZero) {
  if (upgradeRequested) {
    return 'Upgrade requested';
  }
  let value;

  if (isTwoDotZero) {
    let highestOrder = 0;

    editions?.length && editions.forEach(edition => {
      highestOrder = highestOrder < edition?.order ? edition.order : highestOrder;
    });
    editions?.length && editions.forEach(edition => {
      if (edition._id === license?._editionId) {
        value = edition.order === highestOrder ? '' : 'requestUpgrade';
      }
    });
    if (license?._changeEditionId) {
      value = 'upgradeEdition';
    }
  } else {
    value = upgradeStatus(license, integration);
  }

  if (value === 'upgrade') {
    return 'Upgrade';
  }
  if (value === 'requestUpgrade') {
    return 'Request upgrade';
  }
  if (value === 'upgradeEdition') {
    return 'upgradeEdition';
  }

  return '';
}

export function expiresInfo(license, dateFormat) {
  const { expires } = license || {};
  const hasExpired = moment(expires) - moment() < 0;
  let expiresText = '';
  const dtExpires = moment(expires);

  if (expires) {
    if (hasExpired) {
      expiresText = `Expired on ${dtExpires.format(dateFormat || 'MMM Do, YYYY')}`;
    } else {
      expiresText = `Expires on ${dtExpires.format(dateFormat || 'MMM Do, YYYY')}`;
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
        label: 'Start free trial',
        id: 'unlimited-flows-button',
      };
    }
  } else if (license.tier === 'free') {
    if (license.status === 'TRIAL_EXPIRED') {
      licenseActionDetails = {
        action: 'upgrade',
        label: 'Request upgrade now',
        id: 'request-upgrade-buttton',
      };
    } else if (license.status === 'IN_TRIAL') {
      if (license.expiresInDays < 1) {
        licenseActionDetails = {
          action: 'upgrade',
          label: 'Request upgrade now',
          id: 'request-upgrade-buttton',
        };
      } else {
        licenseActionDetails = {
          action: 'upgrade',
          label: 'Request upgrade now -',
          daysLeft: `${license.expiresInDays} days left`,
          id: 'request-upgrade-buttton',
        };
        licenseActionDetails.expiresSoon = license.expiresInDays < 10;
      }
    } else if (license.type === 'endpoint' && !license.trialEndDate) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'Start free trial',
        id: 'unlimited-flows-button',
      };
    } else if (!license.trialEndDate && !license.expires) {
      licenseActionDetails = {
        action: 'startTrial',
        label: 'Start free trial',
        id: 'unlimited-flows-button',
      };
    }
  }

  licenseActionDetails.upgradeRequested = license.upgradeRequested;

  return licenseActionDetails;
}

export function isNextTheHighestPlan(changeEditionId, isTwoDotZero, editions) {
  let value = false;

  if (!changeEditionId || !editions) return value;

  if (isTwoDotZero) {
    let highestOrder = 0;

    editions?.length && editions.forEach(edition => {
      highestOrder = highestOrder < edition?.order ? edition.order : highestOrder;
    });
    editions?.length && editions.forEach(edition => {
      if (edition._id === changeEditionId) {
        value = edition.order === highestOrder;
      }
    });
  }

  return value;
}
