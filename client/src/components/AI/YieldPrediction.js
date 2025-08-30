import React, { useState } from 'react';
import { useMutation } from 'react-query';
import api from '../../utils/api';
import { useForm } from 'react-hook-form';
import { 
  Calculator, 
  TrendingUp, 
  Calendar,
  Sun,
  Droplets,
  Thermometer,
  CloudRain,
  Wind
} from 'lucide-react';
import toast from 'react-hot-toast';

const YieldPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Fetch prediction history
  const fetchHistory = async () => {
    try {
      const response = await api.get('/ai/yield-predictions');
      setPredictions(response.data.predictions || []);
    } catch (error) {
      console.error('Failed to fetch prediction history:', error);
    }
  };

  // Yield prediction mutation
  const predictionMutation = useMutation(
    async (data) => {
      const response = await api.post('/ai/yield-prediction', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setPrediction(data);
        toast.success('Yield prediction generated successfully!');
        fetchHistory(); // Refresh history
      },
      onError: (error) => {
        toast.error('Failed to generate prediction. Please try again.');
      }
    }
  );

  const onSubmit = (data) => {
    predictionMutation.mutate(data);
  };

  const cropTypes = [
    'Corn', 'Soybeans', 'Wheat', 'Rice', 'Cotton', 'Potatoes', 'Tomatoes',
    'Lettuce', 'Carrots', 'Onions', 'Peppers', 'Cucumbers', 'Strawberries'
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-farm rounded-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Yield Predictions</h2>
          <p className="text-gray-600">Get AI-powered crop yield forecasts based on your farm data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Prediction Input
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Crop Type */}
              <div>
                <label className="form-label">Crop Type</label>
                <select
                  {...register('cropType', { required: 'Crop type is required' })}
                  className="input-field"
                >
                  <option value="">Select a crop</option>
                  {cropTypes.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                {errors.cropType && (
                  <p className="text-red-600 text-sm mt-1">{errors.cropType.message}</p>
                )}
              </div>

              {/* Farm Size */}
              <div>
                <label className="form-label">Farm Size (acres)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register('farmSize', { 
                    required: 'Farm size is required',
                    min: { value: 0.1, message: 'Farm size must be positive' }
                  })}
                  placeholder="e.g., 100"
                  className="input-field"
                />
                {errors.farmSize && (
                  <p className="text-red-600 text-sm mt-1">{errors.farmSize.message}</p>
                )}
              </div>

              {/* Soil Moisture */}
              <div>
                <label className="form-label">Soil Moisture (%)</label>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('soilMoisture', { 
                      required: 'Soil moisture is required',
                      min: { value: 0, message: 'Soil moisture must be positive' },
                      max: { value: 100, message: 'Soil moisture cannot exceed 100%' }
                    })}
                    placeholder="e.g., 65"
                    className="input-field"
                  />
                </div>
                {errors.soilMoisture && (
                  <p className="text-red-600 text-sm mt-1">{errors.soilMoisture.message}</p>
                )}
              </div>

              {/* Temperature */}
              <div>
                <label className="form-label">Temperature (°C)</label>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('temperature', { 
                      required: 'Temperature is required',
                      min: { value: -50, message: 'Temperature too low' },
                      max: { value: 60, message: 'Temperature too high' }
                    })}
                    placeholder="e.g., 25"
                    className="input-field"
                  />
                </div>
                {errors.temperature && (
                  <p className="text-red-600 text-sm mt-1">{errors.temperature.message}</p>
                )}
              </div>

              {/* Rainfall */}
              <div>
                <label className="form-label">Rainfall (mm)</label>
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-500" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('rainfall', { 
                      required: 'Rainfall is required',
                      min: { value: 0, message: 'Rainfall must be positive' }
                    })}
                    placeholder="e.g., 150"
                    className="input-field"
                  />
                </div>
                {errors.rainfall && (
                  <p className="text-red-600 text-sm mt-1">{errors.rainfall.message}</p>
                )}
              </div>

              {/* Leaf */}
              <div>
                <label className="form-label">Leaf (kg/acre)</label>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-green-500" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('fertilizer', { 
                      required: 'Leaf amount is required',
                      min: { value: 0, message: 'Leaf amount must be positive' }
                    })}
                    placeholder="e.g., 200"
                    className="input-field"
                  />
                </div>
                {errors.fertilizer && (
                  <p className="text-red-600 text-sm mt-1">{errors.fertilizer.message}</p>
                )}
              </div>

              {/* Planting Date */}
              <div>
                <label className="form-label">Planting Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <input
                    type="date"
                    {...register('plantingDate', { required: 'Planting date is required' })}
                    className="input-field"
                  />
                </div>
                {errors.plantingDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.plantingDate.message}</p>
                )}
              </div>

              {/* Historical Yield */}
              <div>
                <label className="form-label">Historical Yield (tons/acre)</label>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('historicalYield', { 
                      min: { value: 0, message: 'Historical yield must be positive' }
                    })}
                    placeholder="e.g., 4.5 (optional)"
                    className="input-field"
                  />
                </div>
                {errors.historicalYield && (
                  <p className="text-red-600 text-sm mt-1">{errors.historicalYield.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={predictionMutation.isLoading}
                className="w-full btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {predictionMutation.isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating Prediction...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Generate Prediction
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-2 space-y-6">
          {prediction ? (
            <>
              {/* Main Prediction Card */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Yield Prediction Results
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Predicted Yield */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-farm-600 mb-2">
                      {prediction.predictedYield}
                    </div>
                    <div className="text-sm text-gray-600">tons/acre</div>
                    <div className="text-xs text-gray-500 mt-1">Predicted Yield</div>
                  </div>

                  {/* Confidence Level */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getConfidenceColor(prediction.confidence)}`}>
                      {Math.round(prediction.confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                    <div className={`text-xs mt-1 ${getConfidenceColor(prediction.confidence)}`}>
                      {getConfidenceText(prediction.confidence)} Confidence
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {prediction.predictedYield >= 4 ? '🌾' : prediction.predictedYield >= 2 ? '🌱' : '⚠️'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {prediction.predictedYield >= 4 ? 'Excellent' : prediction.predictedYield >= 2 ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {prediction.recommendations && prediction.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Wind className="h-4 w-4 text-yellow-500" />
                      Recommendations
                    </h4>
                    <div className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-farm-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prediction Details */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Crop Type</div>
                    <div className="font-medium">{prediction.cropType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Farm Size</div>
                    <div className="font-medium">{prediction.farmSize} acres</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Soil Moisture</div>
                    <div className="font-medium">{prediction.soilMoisture}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Temperature</div>
                    <div className="font-medium">{prediction.temperature}°C</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Prediction Yet</h3>
              <p className="text-gray-600 mb-4">
                Fill out the form on the left to generate your first AI-powered yield prediction.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Wind className="h-4 w-4" />
                Predictions are based on historical data and current conditions
              </div>
            </div>
          )}

          {/* Prediction History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Prediction History
              </h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
            
            {showHistory && (
              <div className="space-y-3">
                {predictions.length > 0 ? (
                  predictions.map((pred) => (
                    <div key={pred.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-farm-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">{pred.cropType}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(pred.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{pred.predictedYield} tons/acre</div>
                        <div className="text-sm text-gray-500">
                          {Math.round(pred.confidence * 100)}% confidence
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No prediction history available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction; 
