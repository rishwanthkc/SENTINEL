import { Shield } from "./Icons"

// Shared split-screen shell for login / register.
export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left — brand / pitch */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 500px at 20% 20%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(600px 400px at 90% 90%, rgba(244,63,94,0.16), transparent 60%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="text-cyan-300">
            <Shield width={34} height={34} />
          </span>
          <span className="brand-mark text-3xl">SENTINEL</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Your safety,{" "}
            <span className="brand-mark">always on watch.</span>
          </h2>
          <p className="mt-5 text-slate-400 text-lg leading-relaxed">
            One tap sends your live location to trusted contacts. Report unsafe
            zones, plan safer routes, and let the command center respond in real
            time.
          </p>
          <div className="mt-8 flex gap-3 flex-wrap">
            {["Instant SOS", "Trusted Contacts", "Safe Routes", "Live Map"].map(
              (t) => (
                <span key={t} className="chip chip-low">
                  {t}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative text-slate-500 text-sm">
          Women Safety Command Center · v1.0
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md fade-up">{children}</div>
      </div>
    </div>
  )
}
