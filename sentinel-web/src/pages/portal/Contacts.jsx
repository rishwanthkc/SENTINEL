import { useEffect, useState } from "react"
import { getUser } from "../../lib/auth"
import { getContacts, addContact } from "../../api/api"
import PageHeader from "../../components/PageHeader"
import { Plus, Phone, Users } from "../../components/Icons"

export default function Contacts() {
  const user = getUser()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    try {
      const data = await getContacts(user.email)
      setContacts(Array.isArray(data) ? data : [])
    } catch {
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setError("")
    setSaving(true)
    try {
      await addContact({
        user_email: user.email,
        contact_name: name.trim(),
        contact_phone: phone.trim(),
      })
      setName("")
      setPhone("")
      await load()
    } catch (err) {
      setError(err.message || "Could not add contact.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Trusted contacts"
        subtitle="These people can be reached when you trigger an emergency."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Add form */}
        <form onSubmit={handleAdd} className="panel p-6 h-fit fade-up">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-5">
            <Plus width={20} height={20} /> Add contact
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                className="field"
                placeholder="e.g. Mom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Phone number</label>
              <input
                className="field"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2">
                {error}
              </p>
            )}
            <button
              className="btn btn-primary w-full"
              disabled={saving}
              type="submit"
            >
              {saving ? <span className="spinner" /> : "Add contact"}
            </button>
          </div>
        </form>

        {/* List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="panel p-10 text-center text-slate-400">
              Loading contacts…
            </div>
          ) : contacts.length === 0 ? (
            <div className="panel p-12 text-center fade-up">
              <span className="text-slate-600 inline-flex">
                <Users width={48} height={48} />
              </span>
              <p className="mt-4 text-slate-300 font-semibold">
                No contacts yet
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Add at least one trusted contact so help can reach you.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="panel panel-hover p-5 flex items-center gap-4 fade-up"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 grid place-items-center font-bold text-slate-900 text-lg shrink-0">
                    {(c.contact_name || "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{c.contact_name}</p>
                    <a
                      href={`tel:${c.contact_phone}`}
                      className="text-slate-400 text-sm flex items-center gap-1 hover:text-cyan-300"
                    >
                      <Phone width={14} height={14} />
                      {c.contact_phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
