import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { 
  Activity, 
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const FarmHealth = () => {
  const [healthResult, setHealthResult] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const healthMutation = useMutation(
    async (data) => {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/farm-health/analysis', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setHealthResult(data);
        toast.success('Farm health analysis completed!');
      },
      onError: () => {
        toast.error('Failed to analyze farm health');
      }
    }
  );

  const onSubmit = (data) => {
    healthMutation.mutate(data);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-farm rounded-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Farm Health Analysis</h2>
          <p className="text-gray-600">Monitor soil health and get AI-powered recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Analysis Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Assessment</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('soilPh', { required: 'Soil pH is required' })}
                  className="input-field"
                  placeholder="6.5"
                />
                {errors.soilPh && <p className="text-red-600 text-sm mt-1">{errors.soilPh.message}</p>}
              </div>
              <div>
                <label className="form-label">Soil Moisture (%)</label>
                <input
                  type="number"
                  {...register('soilMoisture', { required: 'Soil moisture is required' })}
                  className="input-field"
                  placeholder="65"
                />
                {errors.soilMoisture && <p className="text-red-600 text-sm mt-1">{errors.soilMoisture.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Temperature (°C)</label>
                <input
                  type="number"
                  {...register('temperature', { required: 'Temperature is required' })}
                  className="input-field"
                  placeholder="25"
                />
                {errors.temperature && <p className="text-red-600 text-sm mt-1">{errors.temperature.message}</p>}
              </div>
              <div>
                <label className="form-label">Humidity (%)</label>
                <input
                  type="number"
                  {...register('humidity', { required: 'Humidity is required' })}
                  className="input-field"
                  placeholder="70"
                />
                {errors.humidity && <p className="text-red-600 text-sm mt-1">{errors.humidity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Crop Health (%)</label>
                <input
                  type="number"
                  {...register('cropHealth', { required: 'Crop health is required' })}
                  className="input-field"
                  placeholder="85"
                />
                {errors.cropHealth && <p className="text-red-600 text-sm mt-1">{errors.cropHealth.message}</p>}
              </div>
              <div>
                <label className="form-label">Pest Presence (%)</label>
                <input
                  type="number"
                  {...register('pestPresence', { required: 'Pest presence is required' })}
                  className="input-field"
                  placeholder="15"
                />
                {errors.pestPresence && <p className="text-red-600 text-sm mt-1">{errors.pestPresence.message}</p>}
              </div>
            </div>

            <div>
              <label className="form-label">Disease Symptoms (%)</label>
              <input
                type="number"
                {...register('diseaseSymptoms', { required: 'Disease symptoms are required' })}
                className="input-field"
                placeholder="10"
              />
              {errors.diseaseSymptoms && <p className="text-red-600 text-sm mt-1">{errors.diseaseSymptoms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={healthMutation.isLoading}
              className="w-full btn-success"
            >
              {healthMutation.isLoading ? 'Analyzing...' : 'Analyze Farm Health'}
            </button>
          </form>
        </div>

        {/* Health Results */}
        <div className="space-y-6">
          {healthResult ? (
            <>
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score</h3>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getHealthColor(healthResult.healthScore)}`}>
                    {healthResult.healthScore}
                  </div>
                  <div className="text-lg text-gray-600 mb-2">{getHealthStatus(healthResult.healthScore)}</div>
                  <div className="text-sm text-gray-500">Overall Farm Health</div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {healthResult.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
              <p className="text-gray-600">Fill out the form to analyze your farm health</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmHealth; 