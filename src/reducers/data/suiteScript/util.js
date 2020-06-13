import moment from 'moment';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

export function tileDisplayName(tile) {
  let name;

  if (tile.name && tile.name.indexOf('Amazon') === 0) {
    name = `${tile.name} - NetSuite Connector`;
  } else {
    switch (tile.name) {
      case 'Salesforce Connector':
        name = 'Salesforce - NetSuite Connector';
        break;
      case 'SVB Connector':
        name = 'SVB - NetSuite Connector';
        break;
      case 'eBay':
      case 'Google Shopping':
      case 'Magento':
      case 'Newegg':
      case 'Nextag':
      case 'Rakuten':
      case 'Sears':
        name = `${tile.name} - NetSuite Connector`;
        break;
      default:
        ({ name } = tile);
    }
  }

  return name;
}

export function parseTiles(tiles) {
  return tiles.map(tile => {
    const displayName = tileDisplayName(tile);
    const connector = SUITESCRIPT_CONNECTORS.find(c =>
      [c.name, c.ssName].includes(displayName)
    );
    return {
      ...tile,
      displayName,
      _connectorId: connector && connector._id,
      urlName: connector && connector.urlName,
    };
  });
}

export function getJobDuration(job) {
  if (job.startedAt && job.endedAt) {
    const dtDiff = moment(moment(job.endedAt) - moment(job.startedAt)).utc();
    let duration = dtDiff.format('HH:mm:ss');

    if (dtDiff.date() > 1) {
      const durationParts = duration.split(':');

      durationParts[0] =
        parseInt(durationParts[0], 10) + (dtDiff.date() - 1) * 24;
      duration = durationParts.join(':');
    }

    return duration;
  }

  return undefined;
}

export function parseJobs(jobs) {
  return jobs.map(job => ({
    ...job,
    duration: getJobDuration(job),
  }));
}
