export default function Profile() {
  return (
    <section className="mt-10">
      <h1 className="text-xl font-bold mb-6">Profile</h1>
      <h3 className="text-lg font-semibold mb-3">Your communities</h3>
      <ul className="space-y-3">
        <li className="space-x-4 flex">
          <span>Community 1</span>
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-2 rounded-sm">View</button>
            <button className="bg-red-500 text-white px-2 rounded-sm">Delete</button>
          </div>
        </li>
        <li className="space-x-4 flex">
          <span>Community 2</span>
          <div className="space-x-2">
            <button className="bg-blue-500 text-white px-2 rounded-sm">View</button>
            <button className="bg-red-500 text-white px-2 rounded-sm">Delete</button>
          </div>
        </li>
      </ul>
    </section>
  )
}
