import { COLOR_SCHEMES, useTheme } from '../../../context/ThemeContext';

export default function AppearancePanel() {
  const { schemeKey, setSchemeRemote } = useTheme();
  const current = COLOR_SCHEMES.find((s)=>s.key===schemeKey) || COLOR_SCHEMES[0];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <div className="text-xs text-gray-500">Active: {current.name}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLOR_SCHEMES.map((s) => (
          <button key={s.key} onClick={()=>setSchemeRemote(s.key)} className={`text-left rounded-lg border p-4 transition ${schemeKey===s.key?'ring-2 ring-gray-900 shadow':'hover:bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.name}</div>
              <div className="flex -space-x-1">
                <span className="h-4 w-4 rounded-full border" style={{ background: s.primary }} />
                <span className="h-4 w-4 rounded-full border" style={{ background: s.accent }} />
              </div>
            </div>
            <div className="mt-3 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded" style={{ background: s.buttonFrom }} /> Button</div>
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded" style={{ background: s.heroText }} /> Hero Text</div>
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded" style={{ background: s.text }} /> Main Text</div>
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h3 className="text-sm font-semibold mb-2">Live Preview</h3>
        <div className="space-y-3">
          <div className="text-2xl font-extrabold" style={{ color: current.heroText }}>Hero Section Title</div>
          <p className="text-sm" style={{ color: current.text }}>Main paragraph text showing how body content looks.</p>
          <button className="px-4 py-2 rounded-md text-white" style={{ backgroundImage: `linear-gradient(to right, ${current.buttonFrom}, ${current.buttonTo})` }}>Primary Button</button>
        </div>
      </div>
    </div>
  );
}


