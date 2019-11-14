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
  const editionArray = ['standard', 'premium', 'enterprise', 'custom fba'];
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
  } else if (
    presentEdition === connectorEdition &&
    presentEdition < highestEdition
  ) {
    return 'requestUpgrade';
  } else if (presentEdition < connectorEdition) {
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
  } else if (value === 'requestUpgrade') {
    return 'CONTACT US TO UPGRADE';
  }

  return '';
}

export function expiresInfo(license) {
  const { expires } = license;
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
