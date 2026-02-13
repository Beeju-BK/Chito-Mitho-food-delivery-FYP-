import React from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaStore, 
  FaMapMarkerAlt, 
  FaFileUpload,
  FaClock,
  FaUtensils,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

import UserSignin from './UserSignin';
import { useState } from 'react';

const RestaurantRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantType: '',
    cuisine: [],
    businessLicense: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    openingTime: '',
    closingTime: '',
    deliveryRadius: '',
    logo: null,
    banner: null,
    licenseDoc: null,
    termsAccepted: false
  });
  const [showPassword, setShowPassword] = React.useState({ password: false, confirm: false });

  const cuisineOptions = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese',
    'Thai', 'American', 'Mediterranean', 'Fast Food', 'Desserts'
  ];

  const restaurantTypes = [
    'Restaurant', 'Cafe', 'Fast Food', 'Food Truck', 
    'Bakery', 'Cloud Kitchen', 'Pizzeria', 'Buffet'
  ];

  const steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Business' },
    { id: 3, label: 'Location' },
    { id: 4, label: 'Documents' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCuisine = (cuisine) => {
    setFormData(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter(c => c !== cuisine)
        : [...prev.cuisine, cuisine]
    }));
  };

  const handleFileChange = (field, file) => {
    if (file) setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const InputField = ({ icon: Icon, label, name, type = "text", placeholder, required = true, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
          placeholder={placeholder}
          required={required}
          {...props}
        />
      </div>
    </div>
  );

  const PasswordField = ({ label, name, show, onToggle }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={formData[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
        </button>
      </div>
    </div>
  );

  const FileUpload = ({ label, name, accept, hint, currentFile }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-all cursor-pointer">
        <input
          type="file"
          onChange={(e) => handleFileChange(name, e.target.files[0])}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id={`${name}-upload`}
        />
        <FaFileUpload className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-sm text-orange-600 font-medium">
          {currentFile ? `✓ ${currentFile.name}` : 'Click to upload'}
        </p>
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-1">Tell us about yourself</p>
      </div>
      
      <InputField icon={FaUser} label="Full Name" name="fullName" placeholder="Full Name" />
      <InputField icon={FaEnvelope} label="Email Address" name="email" type="email" placeholder="vendor@example.com" />
      <InputField icon={FaPhone} label="Phone Number" name="phone" type="tel" placeholder="9876543210" />
      <PasswordField 
        label="Password" 
        name="password" 
        show={showPassword.password}
        onToggle={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
      />
      <PasswordField 
        label="Confirm Password" 
        name="confirmPassword" 
        show={showPassword.confirm}
        onToggle={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Business Information</h2>
        <p className="text-sm text-gray-500 mt-1">Tell us about your restaurant</p>
      </div>
      
      <InputField icon={FaStore} label="Restaurant Name" name="restaurantName" placeholder="Delicious Bites" />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Restaurant Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.restaurantType}
          onChange={(e) => handleChange('restaurantType', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
          required
        >
          <option value="">Select Type</option>
          {restaurantTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cuisine Types <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {cuisineOptions.map(cuisine => (
            <button
              key={cuisine}
              type="button"
              onClick={() => toggleCuisine(cuisine)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                formData.cuisine.includes(cuisine)
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-orange-500'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
        {formData.cuisine.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">{formData.cuisine.length} selected</p>
        )}
      </div>

       

      <div className="grid grid-cols-2 gap-4">
        <InputField icon={FaClock} label="Opening Time" name="openingTime" type="time" />
        <InputField icon={FaClock} label="Closing Time" name="closingTime" type="time" />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
        <p className="text-sm text-gray-500 mt-1">Where are you located?</p>
      </div>
      
      <InputField icon={FaMapMarkerAlt} label="Street Address" name="address" placeholder="123 Main Street" />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            placeholder="New York"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            placeholder="NY"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ZIP Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
          placeholder="10001"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Radius (km) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.deliveryRadius}
          onChange={(e) => handleChange('deliveryRadius', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
          placeholder="5"
          min="1"
          max="50"
          required
        />
        <p className="text-xs text-gray-500 mt-1.5">Maximum distance for deliveries</p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
        <p className="text-sm text-gray-500 mt-1">Upload required documents</p>
      </div>
      
      <FileUpload 
        label="Restaurant Logo" 
        name="logo" 
        accept="image/*" 
        hint="PNG or JPG, max 2MB"
        currentFile={formData.logo}
      />
      
      <FileUpload 
        label="Banner Image" 
        name="banner" 
        accept="image/*" 
        hint="PNG or JPG, max 5MB (1200x400px recommended)"
        currentFile={formData.banner}
      />
      
      <FileUpload 
        label="Business License" 
        name="licenseDoc" 
        accept=".pdf,.jpg,.jpeg,.png" 
        hint="PDF, PNG, or JPG, max 5MB"
        currentFile={formData.licenseDoc}
      />

      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleChange('termsAccepted', e.target.checked)}
            className="mt-0.5 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            I agree to the <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Terms</a> and <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Privacy Policy</a>. All information provided is accurate.
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-xl mb-4">
            <FaUtensils className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner With Us</h1>
          <p className="text-gray-600 text-sm">Join our platform and grow your business</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep > step.id 
                      ? 'bg-orange-500 border-orange-500 text-white' 
                      : currentStep === step.id
                      ? 'bg-white border-orange-500 text-orange-500'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <FaCheckCircle className="text-sm" /> : step.id}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${
                    currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                >
                  <FaArrowLeft className="text-xs" />
                  Previous
                </button>
              ) : <div />}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium text-sm"
                >
                  Next
                  <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
       
          >
            Sign in
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegistration;