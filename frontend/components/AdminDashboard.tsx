const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-black mb-6">Admin Console</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-slate-600">
          Manage appointments, patient queue, and system analytics.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="font-bold">All Appointments</h2>
          </div>

          <div className="bg-green-50 p-6 rounded-xl">
            <h2 className="font-bold">Patient Queue</h2>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl">
            <h2 className="font-bold">System Stats</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;