import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next'; 

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const inp      = 'w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpErr   = 'w-full border border-red-300 rounded-2xl px-4 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';
const inpPw    = 'w-full border border-gray-200 rounded-2xl px-4 pr-11 py-3 text-sm outline-none focus:border-dark bg-gray-50 transition-colors placeholder:text-gray-300';
const inpPwErr = 'w-full border border-red-300 rounded-2xl px-4 pr-11 py-3 text-sm outline-none focus:border-red-400 bg-red-50/30 transition-colors placeholder:text-gray-300';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation(); 

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

  const handleSaveName = async () => {
    if (!name.trim())           { setNameError(t('profile_name_required')); return; }      
    if (name.trim().length < 2) { setNameError(t('profile_name_min_length')); return; }   
    setSavingName(true);
    try {
      const res = await api.put('/auth/profile', { name: name.trim() });
      if (res.data?.success) {
        const trimmed = name.trim();
        setSavedName(trimmed);
        updateUser({ ...user!, name: trimmed });
        toast.success(t('profile_name_updated')); 
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('profile_name_update_error')); 
    } finally {
      setSavingName(false);
    }
  };

  const validatePassword = (): boolean => {
    const e: Partial<PasswordForm> = {};
    if (!passwords.oldPassword)                                              e.oldPassword    = t('profile_current_pw_required');   
    if (!passwords.newPassword)                                              e.newPassword    = t('profile_new_pw_required');         
    else if (passwords.newPassword.length < 6)                              e.newPassword    = t('profile_pw_min_length');           
    else if (passwords.newPassword === passwords.oldPassword)               e.newPassword    = t('profile_pw_must_differ');          
    if (!passwords.confirmPassword)                                          e.confirmPassword = t('profile_confirm_pw_required');   
    else if (passwords.newPassword !== passwords.confirmPassword)           e.confirmPassword = t('profile_pw_not_match');           
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
        toast.success(t('profile_pw_changed')); 
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setPasswordErrors({ oldPassword: t('profile_current_pw_wrong') }); 
        toast.error(t('profile_current_pw_wrong'));                          
      } else {
        toast.error(err?.response?.data?.message || t('profile_pw_change_error')); 
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const setPw = (k: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [k]: e.target.value }));
    if (passwordErrors[k]) setPasswordErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };

  const pwStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: t('profile_pw_too_short'), bar: 'bg-red-400',    w: '20%',  text: 'text-red-400'    }; 
    const score = [/[A-Z]/.test(pw), /\d/.test(pw), /[^a-zA-Z0-9]/.test(pw)].filter(Boolean).length;
    if (pw.length < 8 || score === 0) return { label: t('profile_pw_weak'),   bar: 'bg-orange-400', w: '45%',  text: 'text-orange-400' }; 
    if (score === 1)                  return { label: t('profile_pw_good'),   bar: 'bg-blue-400',   w: '75%',  text: 'text-blue-500'   }; 
    return                                   { label: t('profile_pw_strong'), bar: 'bg-green-500',  w: '100%', text: 'text-green-500'  }; 
  };
  const strength = pwStrength(passwords.newPassword);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-dark">{t('profile_account')}</h1>         {/* ← GANTI */}
        <p className="text-gray-400 text-sm mt-1 italic">{t('profile_account_subtitle')}</p>          {/* ← GANTI */}
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="font-bold text-dark text-base">{t('profile_info_title')}</h2>               {/* ← GANTI */}
          <p className="text-xs text-gray-400 mt-0.5">{t('profile_info_subtitle')}</p>               {/* ← GANTI */}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">
            {t('profile_full_name')} <span className="text-red-400">*</span>                          
          </label>
          <input
            type="text"
            placeholder={t('profile_full_name_placeholder')}                                          
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
          <label className="block text-sm font-semibold text-dark mb-2">{t('email')}</label>         {/* ← GANTI */}
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed select-none"
          />
          <p className="text-xs text-gray-300 mt-1.5">{t('profile_email_hint')}</p>                  {/* ← GANTI */}
        </div>

        {/* Role — read only */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">{t('profile_role')}</label>  {/* ← GANTI */}
          <input
            type="text"
            value={user?.role || 'admin'}
            readOnly
            className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed select-none capitalize"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className={`text-xs font-medium ${isNameDirty ? 'text-amber-500' : 'text-gray-300'}`}>
            {isNameDirty ? t('profile_unsaved_changes') : t('profile_all_saved')}                    {/* ← GANTI */}
          </p>
          <button
            onClick={handleSaveName}
            disabled={savingName || !isNameDirty}
            className="flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {savingName
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('saving')}</>  
              : <><Save size={14} />{t('blog_save_changes')}</>                                                                      
            }
          </button>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="font-bold text-dark text-base">{t('profile_change_pw_title')}</h2>          {/* ← GANTI */}
          <p className="text-xs text-gray-400 mt-0.5">{t('profile_change_pw_subtitle')}</p>          {/* ← GANTI */}
        </div>

        {/* Current password */}
        <div>
          <label className="block text-sm font-semibold text-dark mb-2">{t('profile_current_pw')}</label> 
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              placeholder={t('profile_current_pw_placeholder')}                                            
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
          <label className="block text-sm font-semibold text-dark mb-2">{t('profile_new_pw')}</label>    
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder={t('profile_new_pw_placeholder')}                                                
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
          <label className="block text-sm font-semibold text-dark mb-2">{t('profile_confirm_pw')}</label> 
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder={t('profile_confirm_pw_placeholder')}                                           
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
              {/* ← GANTI */}
              {passwords.newPassword === passwords.confirmPassword ? `✓ ${t('profile_pw_match')}` : `✗ ${t('profile_pw_not_match')}`}
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
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t('saving')}</>  
              : <><Save size={14} />{t('profile_change_pw_btn')}</>                                                                
            }
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;