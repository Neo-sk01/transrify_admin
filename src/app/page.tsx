import { ErrorBoundary } from "@/components/ErrorBoundary";

const highlights = [
  {
    title: "Real-time monitoring",
    desc: "Live sessions, incidents, and evidence with offline-aware polling.",
  },
  {
    title: "Evidence you can trust",
    desc: "Direct S3 access with presigned URLs for audio and video capture.",
  },
  {
    title: "Rapid response",
    desc: "Duress signals, verification status, and incident insights in one view.",
  },
];

const actions = [
  {
    label: "Open Admin Dashboard",
    href: "/admin",
    primary: true,
  },
  {
    label: "Try the Demo",
    href: "/demo",
    primary: false,
  },
];

const pillars = [
  {
    title: "Security-first design",
    points: ["Evidence integrity via presigned URLs", "Verification status badges", "Granular incident insights"],
  },
  {
    title: "Operator-friendly UX",
    points: ["Tabbed overview of sessions, incidents, logs", "Stable media playback for evidence", "Offline-aware refresh"],
  },
  {
    title: "Actionable visibility",
    points: ["Open vs closed incidents at a glance", "Audio/Video evidence labeling", "Fast drill-down into sessions"],
  },
];

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
          {/* Hero */}
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold shadow-sm">
                TRANSRIFY • AUTH MONITORING
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                A command center for duress authentication & evidence oversight
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                Monitor sessions, incidents, and evidence in real time. Review audio/video captures, verify status, and respond faster—without leaving the dashboard.
              </p>

              <div className="flex flex-wrap gap-3">
                {actions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`inline-flex items-center justify-center px-5 py-3 rounded-lg text-sm font-semibold min-w-[160px] min-h-[44px] transition-all duration-200 ${
                      action.primary
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                        : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300"
                    }`}
                  >
                    {action.label} →
                  </a>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Live overview</p>
                  <p className="text-lg font-semibold text-gray-900">Admin dashboard snapshot</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  • Online
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-700 font-semibold">Sessions</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">128</p>
                  <p className="text-xs text-blue-700 mt-1">Duress: 3 • Normal: 119 • Fail: 6</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <p className="text-xs text-orange-700 font-semibold">Incidents</p>
                  <p className="text-2xl font-bold text-orange-900 mt-1">9</p>
                  <p className="text-xs text-orange-700 mt-1">Open: 4 • Closed: 5</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-green-700 font-semibold">Evidence</p>
                  <p className="text-sm text-gray-800 mt-1">
                    Audio/Video captures with verification status, presigned URLs, and stable playback in a dedicated modal.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">Why this matters</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Confidence: Verification badges for each evidence item</li>
                  <li>Speed: One-click access to incidents and media</li>
                  <li>Resilience: Offline-aware refresh when connectivity drops</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Pillars */}
          <section className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">{pillar.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 inline-block" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
