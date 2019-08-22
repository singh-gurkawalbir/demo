import JobDashboard from '../../components/JobDashboard';

export default function IntegrationDashboard(props) {
  return <JobDashboard integrationId={props.match.params.integrationId} />;
}
