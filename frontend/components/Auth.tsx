
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onNavigateHome: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onNavigateHome }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    bloodType: 'A+',
    weight: '',
    height: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulation of secure password hashing
  const hashPassword = async (password: string) => {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const storedUsersRaw = localStorage.getItem('hospital_users');
      const users: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      const hashedPassword = await hashPassword(formData.password);

      if (mode === 'signup') {
        if (users.find(u => u.email === formData.email)) {
          throw new Error("User with this email already exists.");
        }

        const newUser: User = {
          id: `P-${Math.floor(10000 + Math.random() * 90000)}`,
          name: formData.name,
          email: formData.email,
          avatar: `https://picsum.photos/seed/${formData.email}/400/400`,
          bloodType: formData.bloodType,
          weight: formData.weight ? `${formData.weight} kg` : '--',
          height: formData.height ? `${formData.height} cm` : '--',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          lastCheckup: 'Pending initial visit',
          passwordHash: hashedPassword
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('hospital_users', JSON.stringify(updatedUsers));
        sessionStorage.setItem('hospital_session_token', `mock_jwt_${btoa(newUser.email)}`);
        onAuthSuccess(newUser);
      } else {
        const user = users.find(u => u.email === formData.email && u.passwordHash === hashedPassword);
        if (!user) {
          throw new Error("Invalid email or password.");
        }
        sessionStorage.setItem('hospital_session_token', `mock_jwt_${btoa(user.email)}`);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in duration-500">
        <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <h2 className="text-3xl font-black tracking-tight mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join MediStream'}
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {mode === 'login' ? 'Access your medical records' : 'Secure patient registration'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100 animate-in shake duration-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-700"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-700"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-700"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="pt-4 space-y-6">
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] mb-4">Initial Health Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                      <select 
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 appearance-none"
                        value={formData.bloodType}
                        onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Weight (kg)</label>
                      <input 
                        type="number"
                        placeholder="70"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-700"
                        value={formData.weight}
                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Height (cm)</label>
                      <input 
                        type="number"
                        placeholder="175"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none font-bold text-slate-700"
                        value={formData.height}
                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:bg-slate-300 flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              mode === 'login' ? 'Sign In Securely' : 'Create Patient Account'
            )}
          </button>

          <div className="pt-6 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {mode === 'login' ? "Don't have an account?" : "Already registered?"}
            </p>
            <button 
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 transition-colors"
            >
              {mode === 'login' ? 'Start Registration' : 'Return to Login'}
            </button>
          </div>
        </form>

        <div className="bg-slate-50 px-10 py-6 text-center border-t border-slate-100">
          <button 
            type="button"
            onClick={onNavigateHome}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
