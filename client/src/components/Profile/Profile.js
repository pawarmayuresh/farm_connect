import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  MapPin, 
  Leaf, 
  Settings, 
  Save,
  Edit,
  Camera
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      farmType: user?.farmType || '',
      location: user?.location || '',
      farmSize: user?.farmSize || '',
      experience: user?.experience || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const farmTypes = [
    'Crop Farming', 'Livestock', 'Mixed Farming', 'Organic Farming',
    'Dairy Farming', 'Poultry', 'Horticulture', 'Aquaculture'
  ];

  const experienceLevels = [
    'Beginner (0-2 years)', 'Intermediate (3-7 years)', 
    'Advanced (8-15 years)', 'Expert (15+ years)'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-primary rounded-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
          <p className="text-gray-600">Manage your account and farm information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{user?.name || 'User Name'}</h3>
            <p className="text-gray-600 mb-3">{user?.farmType || 'Farmer'}</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.location || 'Location not set'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Leaf className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.farmSize || '0'} acres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary"
              >
                {isEditing ? 'Cancel' : <><Edit className="h-4 w-4 mr-2" />Edit</>}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="form-label">Email</label>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Farm Type</label>
                  <select
                    {...register('farmType', { required: 'Farm type is required' })}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  >
                    <option value="">Select farm type</option>
                    {farmTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.farmType && <p className="text-red-600 text-sm mt-1">{errors.farmType.message}</p>}
                </div>
                
                <div>
                  <label className="form-label">Location</label>
                  <input
                    {...register('location', { required: 'Location is required' })}
                    placeholder="City, State"
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Farm Size (acres)</label>
                  <input
                    {...register('farmSize', { 
                      required: 'Farm size is required',
                      min: { value: 0, message: 'Farm size must be positive' }
                    })}
                    type="number"
                    step="0.1"
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  />
                  {errors.farmSize && <p className="text-red-600 text-sm mt-1">{errors.farmSize.message}</p>}
                </div>
                
                <div>
                  <label className="form-label">Farming Experience</label>
                  <select
                    {...register('experience')}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-50"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </div>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 