import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName,
        email: user.email,
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('one special character');
    }
    return errors;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (profileData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await userService.updateProfile(profileData);
      updateUser(response.data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      setErrors({ profile: message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordErrors = validatePassword(passwordData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    if (!passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm new password';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      setErrors({ password: message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      fullName: user.fullName,
      email: user.email,
    });
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return <Spinner fullPage />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        {/* User Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Profile Information</h2>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <form onSubmit={handleProfileUpdate}>
            {errors.profile && (
              <div className="alert alert-error">{errors.profile}</div>
            )}

            <div className="user-info-item">
              <strong>Role:</strong>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
            </div>

            <div className="user-info-item">
              <strong>Status:</strong>
              <span className={`badge badge-${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="user-info-item">
              <strong>Member Since:</strong>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              error={errors.fullName}
              disabled={!isEditing}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              error={errors.email}
              disabled={!isEditing}
              required
            />

            {isEditing && (
              <div className="form-actions">
                <Button type="submit" variant="primary" loading={loading}>
                  Save Changes
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Change Password Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Change Password</h2>
          </div>

          <form onSubmit={handlePasswordUpdate}>
            {errors.password && (
              <div className="alert alert-error">{errors.password}</div>
            )}

            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={errors.currentPassword}
              placeholder="Enter current password"
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={errors.newPassword}
              placeholder="Enter new password"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              error={errors.confirmNewPassword}
              placeholder="Confirm new password"
              required
            />

            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={passwordData.newPassword.length >= 8 ? 'valid' : ''}>
                  At least 8 characters
                </li>
                <li className={/[a-z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                  One lowercase letter
                </li>
                <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(passwordData.newPassword) ? 'valid' : ''}>
                  One number
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? 'valid' : ''}>
                  One special character
                </li>
              </ul>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" loading={loading}>
                Change Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
