export default function UserPortal() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    )

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl text-cyan-400 font-bold">

        User Portal

      </h1>

      <p className="mt-6">

        Welcome {user.display_name}

      </p>

      <p>

        {user.email}

      </p>

    </div>
  )
}