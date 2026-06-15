import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser, loginUser } from "../api/api"
import { setUser } from "../lib/auth"
import AuthShell from "../components/AuthShell"
import { Shield } from "../components/Icons"

function makeUid() {
  if (window.crypto && window.crypto.randomUUID) {
    return "web-" + window.crypto.randomUUID()
  }
  return "web-" + Math.random().toString(36).slice(2) + Date.now()
}

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    if (!email.trim() || !name.trim()) return
    setError("")
    setLoading(true)
    try {
      await registerUser({
        email: email.trim(),
        display_name: name.trim(),
        firebase_uid: makeUid(),
      })
      // Auto sign-in after successful registration.
      const data = await loginUser(email.trim())
      setUser(data)
      navigate(data.role === "ADMIN" ? "/dashboard" : "/portal")
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <span className="text-cyan-300">
          <Shield width={30} height={30} />
        </span>
        <span className="brand-mark text-2xl">SENTINEL</span>
      </div>

      <h1 className="text-3xl font-extrabold">Create your account</h1>
      <p className="text-slate-400 mt-2">
        Join the network. Stay protected, everywhere.
      </p>

      <form onSubmit={handleRegister} className="mt-8 space-y-5">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            className="field"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {error && (
          <div className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-slate-400 text-sm">
        Already have an account?{" "}
        <Link to="/" className="text-cyan-300 font-semibold">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
