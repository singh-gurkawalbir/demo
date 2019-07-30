import JobDashboard from '../../components/JobDashboard';

export default function IntegrationDashboard(props) {
  return (
    <JobDashboard
      integrationId={props.match.params.integrationId}
      flowId="5ac75505599e3f1ad9d71812"
    />
  );
}
