import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const presetAvatars = [
  // Clinical / Medical
  '🩺', '🥼', '👩‍⚕️', '👨‍⚕️', '🏥', '🔬', '🧪', '🩹', '🩸', '🧬',
  // Nature / Ayurvedic
  '🌿', '🌱', '🍃', '🍀', '🌸', '🌼', '🍵', '🥥', '🍋', '🍯',
  // Joyful / Lifestyle
  '😎', '😊', '🤩', '🥰', '🥳', '🧠', '🥗', '🧘‍♀️', '🧘‍♂️', '🏃‍♂️',
  // Cute Animals
  '🦁', '🐼', '🐨', '🦊', '🦉', '🐱', '🐶', '🦄', '🐯', '🐧',
  // Vibrant Symbols
  '🎨', '🔮', '💫', '✨', '🌈', '🌊', '☀️', '🌙', '🏔️', '🌲'
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '🩺');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (password && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name,
        email,
        profilePicture
      };
      
      if (password) {
        payload.password = password;
      }

      const { data } = await authAPI.updateProfile(payload);
      updateUser(data);
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-16 py-8 relative">
      {/* Toast Messages */}
      {successMsg && (
        <div className="fixed top-24 right-8 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-24 right-8 bg-rose-950 text-rose-100 px-5 py-3 rounded-xl shadow-xl z-50 animate-bounce flex items-center gap-2 text-[14px] font-semibold border border-rose-800">
          <span className="material-symbols-outlined text-rose-400 text-[20px]">error</span>
          {errorMsg}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[30px] md:text-[36px] leading-[40px] font-black text-on-surface tracking-tight text-gradient-animated">
          Profile Settings
        </h1>
        <p className="text-[15px] text-on-surface-variant font-medium mt-1">
          Customize your credentials, password, and pick from 50+ playful avatar styles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Info Fields Form */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-soft card-interactive space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-teal-100 text-teal-800 rounded-xl flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-slate-900">Personal Details</h2>
              <p className="text-[12px] text-slate-500 font-semibold">Update your account credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-slate-900">Security</h2>
              <p className="text-[12px] text-slate-500 font-semibold">Leave blank if you don't wish to change password</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[14px] text-slate-900 font-semibold focus:bg-white focus:border-teal-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-700/60 text-white font-extrabold text-[15px] py-4 rounded-xl shadow-md transition-all active:scale-98"
          >
            {saving ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>
        </form>

        {/* 50 Preset Avatar Grid Selector */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft card-interactive flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[28px] shadow-2xs">
              {profilePicture}
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900">Choose Profile Icon</h3>
              <p className="text-[12px] text-slate-500 font-semibold">Select from 50 clinical & lifestyle emojis</p>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-t border-slate-100 pt-3">
            {presetAvatars.map((avatar, idx) => {
              const isSelected = profilePicture === avatar;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProfilePicture(avatar)}
                  className={`w-11 h-11 flex items-center justify-center text-[24px] rounded-xl transition-all border cursor-pointer active:scale-90 ${
                    isSelected 
                      ? 'border-teal-600 bg-teal-50 shadow-sm scale-110' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {avatar}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
