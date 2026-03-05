import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const inp    = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpErr = 'w-full border border-red-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';
const inpPw  = 'w-full border border-gray-200 rounded-2xl px-4 pr-11 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpPwErr = 'w-full border border-red-300 rounded-2xl px-4 pr-11 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName]             = useState('');
  const [savedName, setSavedName]   = useState('');
  const [nameError, setNameError]   = useState('');
  const [savingName, setSavingName] = useState(false);

  const [passwords, setPasswords]           = useState<PasswordForm>({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordForm>>({});
  const [savingPassword, setSavingPassword] = useState(false);
  const [showOld, setShowOld]               = useState(false);
  const [showNew, setShowNew]               = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSavedName(user.name || '');
    }
  }, [user]);

  const isNameDirty    = name !== savedName;
  const passwordFilled = !!(passwords.oldPassword || passwords.newPassword || passwords.confirmPassword);

  /* ── Save name ── */
  const handleSaveName = async () => {
    if (!name.trim())            { setNameError('Name is required'); return; }
    if (name.trim().length < 2)  { setNameError('Name must be at least 2 characters'); return; }

    setSavingName(true);
    try {
      const res = await api.put('/auth/profile', { name: name.trim() });
      if (res.data?.success) {
        const trimmed = name.trim();
        setSavedName(trimmed);
        // Update AuthContext state + localStorage in one call
        updateUser({ ...user!, name: trimmed });
        toast.success('Name updated!');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  /* ── Save password ── */
  const validatePassword = (): boolean => {
    const e: Partial<PasswordForm> = {};
    if (!passwords.oldPassword) e.oldPassword = 'Current password is required';
    if (!passwords.newPassword) e.newPassword = 'New password is required';
    else if (passwords.newPassword.length < 6) e.newPassword = 'Minimum 6 characters';
    else if (passwords.newPassword === passwords.oldPassword) e.newPassword = 'Must differ from current password';
    if (!passwords.confirmPassword) e.confirmPassword = 'Please confirm your new password';
    else if (passwords.newPassword !== passwords.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      const res = await api.put('/auth/password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      if (res.data?.success) {
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        toast.success('Password changed!');
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setPasswordErrors({ oldPassword: 'Current password is incorrect' });
        toast.error('Wrong current password');
      } else {
        toast.error(err?.response?.data?.message || 'Failed to change password');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const setPw = (k: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [k]: e.target.value }));
    if (passwordErrors[k]) setPasswordErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };

  /* ── Password strength ── */
  const pwStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Too short', bar: 'bg-red-400',    w: '20%',  text: 'text-red-400'    };
    const score = [/[A-Z]/.test(pw), /\d/.test(pw), /[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length;
    if (pw.length < 8 || score === 0) return { label: 'Weak',   bar: 'bg-orange-400', w: '45%',  text: 'text-orange-400' };
    if (score === 1)                  return { label: 'Good',   bar: 'bg-blue-400',   w: '75%',  text: 'text-blue-500'   };
    return                                   { label: 'Strong', bar: 'bg-green-500',  w: '100%', text: 'text-green-500'  };
  };
  const strength = pwStrength(passwords.newPassword);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">Account</h1>
        <p className="text-gray-400 text-sm mt-1 italic">Manage your profile and password</p>
      </div>

      {/* ── Profile Section ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="font-bold text-dark text-base">Profile Information</h2>
          <p className="text-xs text-gray-400 mt-0.5">Update your display name</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={e => { setName(e.target.value); setNameError(''); }}
            className={nameError ? inpErr : inp}
          />
          {nameError && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
              <AlertCircle size={11} />{nameError}
            </p>
          )}
        </div>

        {/* Email — read only */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed select-none"
          />
          <p className="text-xs text-gray-300 mt-1.5">Contact a superadmin to change email</p>
        </div>

        {/* Role — read only */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Role</label>
          <input
            type="text"
            value={user?.role || 'admin'}
            readOnly
            className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed select-none capitalize"
          />
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-1">
          <p className={`text-xs font-medium ${isNameDirty ? 'text-amber-500' : 'text-gray-300'}`}>
            {isNameDirty ? '• Unsaved changes' : 'All changes saved'}
          </p>
          <button
            onClick={handleSaveName}
            disabled={savingName || !isNameDirty}
            className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {savingName
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : <><Save size={14} />Save Changes</>
            }
          </button>
        </div>
      </div>

      {/* ── Change Password Section ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="font-bold text-dark text-base">Change Password</h2>
          <p className="text-xs text-gray-400 mt-0.5">Enter your current password to set a new one</p>
        </div>

        {/* Current password */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder="Enter your current password"
              value={passwords.oldPassword}
              onChange={setPw('oldPassword')}
              className={passwordErrors.oldPassword ? inpPwErr : inpPw}
            />
            <button type="button" onClick={() => setShowOld(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors">
              {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {passwordErrors.oldPassword && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
              <AlertCircle size={11} />{passwordErrors.oldPassword}
            </p>
          )}
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={passwords.newPassword}
              onChange={setPw('newPassword')}
              className={passwordErrors.newPassword ? inpPwErr : inpPw}
            />
            <button type="button" onClick={() => setShowNew(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors">
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {strength && (
            <div className="mt-2 space-y-1">
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.bar}`} style={{ width: strength.w }} />
              </div>
              <p className={`text-xs font-medium ${strength.text}`}>{strength.label}</p>
            </div>
          )}
          {passwordErrors.newPassword && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
              <AlertCircle size={11} />{passwordErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              value={passwords.confirmPassword}
              onChange={setPw('confirmPassword')}
              className={passwordErrors.confirmPassword ? inpPwErr : inpPw}
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {passwords.confirmPassword && !passwordErrors.confirmPassword && (
            <p className={`text-xs mt-1.5 font-medium ${passwords.newPassword === passwords.confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
              {passwords.newPassword === passwords.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}
          {passwordErrors.confirmPassword && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
              <AlertCircle size={11} />{passwordErrors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSavePassword}
            disabled={savingPassword || !passwordFilled}
            className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {savingPassword
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
              : <><Save size={14} />Change Password</>
            }
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;