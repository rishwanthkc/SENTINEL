import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../api/api"
import { setUser } from "../lib/auth"
import AuthShell from "../components/AuthShell"
import { Shield } from "../components/Icons"

export default function Login() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    if (!email.trim()) return
    setError("")
    setLoading(true)
    try {
      const data = await loginUser(email.trim())
      setUser(data)
      navigate(data.role === "ADMIN" ? "/dashboard" : "/portal")
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
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

      <h1 className="text-3xl font-extrabold">Welcome back</h1>
      <p className="text-slate-400 mt-2">
        Sign in to your safety command center.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
          {loading ? <span className="spinner" /> : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-slate-400 text-sm">
        New to SENTINEL?{" "}
        <Link to="/register" className="text-cyan-300 font-semibold">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
