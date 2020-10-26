export default function useGetNotificationOptions({ flows, connections }) {
  const flowOps = flows.reduce((finalOps, f) => {
    finalOps.push({ value: f._id, label: f.name });

    return finalOps;
  }, []);
  const connectionOps = connections.map(c => ({ value: c._id, label: c.name }));

  return { flowOps, connectionOps };
}
