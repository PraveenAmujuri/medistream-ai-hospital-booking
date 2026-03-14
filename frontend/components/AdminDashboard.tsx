import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("hospital_appointments");

    if (saved) {
      const all = JSON.parse(saved);

      // ⭐ show only active appointments
      const active = all.filter((a: any) => a.status === "Scheduled");
        const priority = { Emergency: 3, Priority: 2, Normal: 1 }

        active.sort((a:any, b:any) => priority[b.urgency] - priority[a.urgency])
      setAppointments(active);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-black mb-6">Admin Console</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Active Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-slate-500">No active appointments</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{appt.patientName}</p>
                  <p className="text-sm text-slate-500">
                    {appt.department}
                  </p>
                  <p className="text-sm text-slate-500">
                    {appt.date} • {appt.time}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {appt.urgency || "Normal"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {appt.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;