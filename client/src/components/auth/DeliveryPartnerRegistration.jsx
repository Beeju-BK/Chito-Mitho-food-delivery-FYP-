import React from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaMotorcycle,
  FaBicycle,
  FaCar,
  FaIdCard,
  FaFileUpload,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaUserCircle,
  FaCamera,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

const DeliveryPartnerRegistration = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleColor: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    workingZones: [],
    preferredShifts: [],
    photo: null,
    idProof: null,
    drivingLicense: null,
    vehicleRC: null,
    vehicleInsurance: null,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    termsAccepted: false,
    backgroundCheckConsent: false
  });
  const [showPassword, setShowPassword] = React.useState({ password: false, confirm: false });

  const vehicleTypes = [
    { value: 'bicycle', label: 'Bicycle', icon: FaBicycle },
    { value: 'motorcycle', label: 'Motorcycle', icon: FaMotorcycle },
    { value: 'car', label: 'Car', icon: FaCar }
  ];

  const workingZones = [
    'Downtown', 'Uptown', 'East Side', 'West Side', 
    'North Zone', 'South Zone', 'Suburbs', 'Airport Area'
  ];

  const shiftOptions = [
    { value: 'morning', label: 'Morning (8 AM - 2 PM)' },
    { value: 'afternoon', label: 'Afternoon (2 PM - 8 PM)' },
    { value: 'evening', label: 'Evening (8 PM - 12 AM)' },
    { value: 'night', label: 'Night (12 AM - 8 AM)' }
  ];

  const steps = [
    { id: 1, label: 'Personal' },
    { id: 2, label: 'Address' },
    { id: 3, label: 'Vehicle' },
    { id: 4, label: 'Documents' },
    { id: 5, label: 'Bank' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleZone = (zone) => {
    setFormData(prev => ({
      ...prev,
      workingZones: prev.workingZones.includes(zone)
        ? prev.workingZones.filter(z => z !== zone)
        : [...prev.workingZones, zone]
    }));
  };

  const toggleShift = (shift) => {
    setFormData(prev => ({
      ...prev,
      preferredShifts: prev.preferredShifts.includes(shift)
        ? prev.preferredShifts.filter(s => s !== shift)
        : [...prev.preferredShifts, shift]
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
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
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
          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
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

  const FileUpload = ({ label, name, accept, hint, currentFile, icon: Icon = FaFileUpload }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
        <input
          type="file"
          onChange={(e) => handleFileChange(name, e.target.files[0])}
          accept={accept}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id={`${name}-upload`}
        />
        <Icon className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-sm text-blue-600 font-medium">
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
      
      <InputField icon={FaUser} label="Full Name" name="fullName" placeholder="John Doe" />
      
      <div className="grid grid-cols-2 gap-4">
        <InputField icon={FaEnvelope} label="Email Address" name="email" type="email" placeholder="john@example.com" />
        <InputField icon={FaPhone} label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Must be 18 years or older</p>
      </div>

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
        <h2 className="text-2xl font-bold text-gray-800">Address & Emergency Contact</h2>
        <p className="text-sm text-gray-500 mt-1">Where are you located?</p>
      </div>
      
      <InputField icon={FaMapMarkerAlt} label="Street Address" name="address" placeholder="123 Main Street, Apt 4B" />
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            placeholder="NY"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            placeholder="10001"
            required
          />
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField icon={FaUserCircle} label="Contact Name" name="emergencyContact" placeholder="Jane Doe" />
          <InputField icon={FaPhone} label="Contact Phone" name="emergencyPhone" type="tel" placeholder="+1 (555) 987-6543" />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Emergency contact will only be used in case of emergencies during deliveries.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vehicle & Work Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">Tell us about your vehicle</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Vehicle Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-4">
          {vehicleTypes.map(vehicle => (
            <button
              key={vehicle.value}
              type="button"
              onClick={() => handleChange('vehicleType', vehicle.value)}
              className={`p-6 rounded-lg border-2 transition-all ${
                formData.vehicleType === vehicle.value
                  ? 'bg-blue-50 border-blue-600 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
              }`}
            >
              <vehicle.icon className="text-4xl mx-auto mb-2" />
              <p className="text-sm font-medium">{vehicle.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.vehicleNumber}
            onChange={(e) => handleChange('vehicleNumber', e.target.value.toUpperCase())}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm uppercase"
            placeholder="ABC-1234"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Model <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.vehicleModel}
            onChange={(e) => handleChange('vehicleModel', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            placeholder="Honda Activa 125"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Color <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.vehicleColor}
          onChange={(e) => handleChange('vehicleColor', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          placeholder="Red"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField icon={FaIdCard} label="Driving License Number" name="drivingLicenseNumber" placeholder="DL-1234567890" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            License Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.licenseExpiryDate}
            onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Working Zones <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {workingZones.map(zone => (
            <button
              key={zone}
              type="button"
              onClick={() => toggleZone(zone)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                formData.workingZones.includes(zone)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
        {formData.workingZones.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">{formData.workingZones.length} selected</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Shifts <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {shiftOptions.map(shift => (
            <button
              key={shift.value}
              type="button"
              onClick={() => toggleShift(shift.value)}
              className={`w-full px-4 py-3 rounded-lg border text-left flex items-center text-sm font-medium transition-all ${
                formData.preferredShifts.includes(shift.value)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
              }`}
            >
              <FaClock className="mr-3 text-sm" />
              {shift.label}
            </button>
          ))}
        </div>
        {formData.preferredShifts.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">{formData.preferredShifts.length} selected</p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upload Documents</h2>
        <p className="text-sm text-gray-500 mt-1">Required documents for verification</p>
      </div>
      
      <FileUpload 
        label="Profile Photo" 
        name="photo" 
        accept="image/*" 
        hint="PNG or JPG (Passport size photo)"
        currentFile={formData.photo}
        icon={FaCamera}
      />
      
      <FileUpload 
        label="ID Proof (Aadhaar/Passport/Voter ID)" 
        name="idProof" 
        accept=".pdf,.jpg,.jpeg,.png" 
        hint="PDF, PNG, or JPG up to 5MB"
        currentFile={formData.idProof}
      />
      
      <FileUpload 
        label="Driving License" 
        name="drivingLicense" 
        accept=".pdf,.jpg,.jpeg,.png" 
        hint="PDF, PNG, or JPG up to 5MB"
        currentFile={formData.drivingLicense}
      />
      
      <FileUpload 
        label="Vehicle Registration Certificate (RC)" 
        name="vehicleRC" 
        accept=".pdf,.jpg,.jpeg,.png" 
        hint="PDF, PNG, or JPG up to 5MB"
        currentFile={formData.vehicleRC}
      />
      
      <FileUpload 
        label="Vehicle Insurance" 
        name="vehicleInsurance" 
        accept=".pdf,.jpg,.jpeg,.png" 
        hint="PDF, PNG, or JPG up to 5MB"
        currentFile={formData.vehicleInsurance}
      />
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
        <p className="text-sm text-gray-500 mt-1">For receiving your earnings</p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Why we need this:</strong> Your earnings will be directly deposited to this bank account weekly.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Holder Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.accountHolderName}
          onChange={(e) => handleChange('accountHolderName', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          placeholder="John Doe"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Must match your ID proof</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bank Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.bankName}
          onChange={(e) => handleChange('bankName', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          placeholder="Chase Bank"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={(e) => handleChange('accountNumber', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          placeholder="1234567890"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IFSC Code / Routing Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.ifscCode}
          onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm uppercase"
          placeholder="ABCD0123456"
          required
        />
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms & Conditions</h3>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.backgroundCheckConsent}
              onChange={(e) => handleChange('backgroundCheckConsent', e.target.checked)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <span className="text-sm text-gray-700">
              I consent to a background verification check and understand that my application may be rejected if discrepancies are found.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => handleChange('termsAccepted', e.target.checked)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <span className="text-sm text-gray-700">
              I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms</a>, <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>, and <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Partner Agreement</a>. All information provided is accurate.
            </span>
          </label>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-green-800 mb-2">What happens next?</h4>
        <ul className="text-sm text-green-700 space-y-1 ml-4 list-disc">
          <li>Your documents will be verified within 24-48 hours</li>
          <li>You'll receive an email confirmation once approved</li>
          <li>Complete a brief orientation session</li>
          <li>Start earning on your first delivery!</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <FaMotorcycle className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Delivery Partner</h1>
          <p className="text-gray-600 text-sm">Earn flexibly on your own schedule</p>
        </div>

        {/* Benefits Banner */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">$20-30</div>
              <div className="text-sm text-gray-600">Per Hour</div>
            </div>
            <div className="border-l border-r border-gray-200">
              <div className="text-2xl font-bold text-blue-600">Flexible</div>
              <div className="text-sm text-gray-600">Work Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">Weekly</div>
              <div className="text-sm text-gray-600">Payments</div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep > step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : currentStep === step.id
                      ? 'bg-white border-blue-600 text-blue-600'
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
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
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
            {currentStep === 5 && renderStep5()}

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
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm"
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
        <p className="text-center text-sm text-gray-600 mt-6">
          Already registered?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default DeliveryPartnerRegistration;