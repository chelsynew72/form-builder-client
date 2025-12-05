'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { Checkbox } from '@/components/ui/Checkbox';
import { User, Mail, Lock, Bell, Trash2, Save } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Profile data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email preferences
  const [emailNotifications, setEmailNotifications] = useState({
    newSubmission: true,
    processingComplete: true,
    processingFailed: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authApi.getProfile();
      const user = response.data;
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      
      // Load email preferences if available
      if (user.emailPreferences) {
        setEmailNotifications(user.emailPreferences);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setToast({ message: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile({
        firstName,
        lastName,
        email,
      });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setToast({ 
        message: error.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setToast({ message: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      setToast({ 
        message: error.response?.data?.message || 'Failed to change password', 
        type: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNotifications = async () => {
    setSaving(true);
    try {
      await authApi.updateEmailPreferences(emailNotifications);
      setToast({ message: 'Email preferences updated!', type: 'success' });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setToast({ message: 'Failed to update preferences', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your forms and submissions will be permanently deleted.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );

    if (doubleConfirm !== 'DELETE') {
      setToast({ message: 'Account deletion cancelled', type: 'error' });
      return;
    }

    try {
      await authApi.deleteAccount();
      setToast({ message: 'Account deleted successfully', type: 'success' });
      setTimeout(() => {
        localStorage.removeItem('token');
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to delete account:', error);
      setToast({ message: 'Failed to delete account', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-600">Update your personal information</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
            <div className="flex justify-end">
              <Button onClick={handleUpdateProfile} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              helperText="Must be at least 6 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={saving}>
                <Lock className="w-4 h-4 mr-2" />
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Notifications</h2>
              <p className="text-sm text-gray-600">Choose when you want to receive emails</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Checkbox
              label="New Submission - Get notified when someone submits a form"
              checked={emailNotifications.newSubmission}
              onChange={(e) => setEmailNotifications({
                ...emailNotifications,
                newSubmission: e.target.checked,
              })}
            />
            <Checkbox
              label="Processing Complete - Get notified when AI processing is done"
              checked={emailNotifications.processingComplete}
              onChange={(e) => setEmailNotifications({
                ...emailNotifications,
                processingComplete: e.target.checked,
              })}
            />
            <Checkbox
              label="Processing Failed - Get notified when processing encounters an error"
              checked={emailNotifications.processingFailed}
              onChange={(e) => setEmailNotifications({
                ...emailNotifications,
                processingFailed: e.target.checked,
              })}
            />
            <Checkbox
              label="Weekly Digest - Receive a weekly summary of all submissions"
              checked={emailNotifications.weeklyDigest}
              onChange={(e) => setEmailNotifications({
                ...emailNotifications,
                weeklyDigest: e.target.checked,
              })}
            />
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleUpdateNotifications} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
              <p className="text-sm text-gray-600">Irreversible actions for your account</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
            <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
            <p className="text-sm text-red-800 mb-4">
              Once you delete your account, there is no going back. All your forms, submissions, and AI outputs will be permanently deleted.
            </p>
            <Button variant="outline" onClick={handleDeleteAccount} className="border-red-300 text-red-600 hover:bg-red-100">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}