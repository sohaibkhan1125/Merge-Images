import { useMaintenance } from '../../../context/MaintenanceContext';

export default function GeneralPanel() {
  const { enabled, setEnabledRemote } = useMaintenance();

  return (
    <div className="p-6">
      <h2 className="text-sm font-semibold mb-4">General Settings</h2>
      <div className="rounded-lg border bg-white p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">Website Maintenance Mode</div>
          <div className="text-sm text-gray-600">Temporarily show a maintenance page to visitors.</div>
        </div>
        <button
          onClick={() => setEnabledRemote(!enabled)}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${enabled ? 'bg-gray-900' : 'bg-gray-300'}`}
          aria-pressed={enabled}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
}


