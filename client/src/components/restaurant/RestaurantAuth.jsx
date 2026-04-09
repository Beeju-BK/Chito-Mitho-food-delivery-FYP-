import axios from "axios"
import { useState } from "react"
import {useNavigate} from "react-router-dom"


import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaUtensils, FaMapMarkerAlt, FaClock, FaImage, FaCheckCircle,
  FaStore, FaChevronRight, FaChevronLeft, FaCloudUploadAlt
} from "react-icons/fa"

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Restaurant" },
  { id: 3, label: "Media" },
]

const RESTAURANT_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cloudKitchen", label: "Cloud Kitchen" },
  { value: "foodTruck", label: "Food Truck" },
]

const iconInputClass =
  "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm outline-none"

const RestaurantAuth = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    address: "", email: "", password: "",
    restaurantName: "", restaurantType: "",
    openingTime: "", closingTime: "",
    RestaurantImage: null,
  })
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const switchMode = () => {
    setIsLogin(prev => !prev)
    setCurrentStep(1)
    setShowPassword(false)
  }

  const onChangeHandler = (e) => {
    const { name, value, files } = e.target
    if (files) {
      const file = files[0]
      set(name, file)
      const url = URL.createObjectURL(file)
      if (name === "restaurantImage") setImagePreview(url)
    } else {
      set(name, value)
    }
  }

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 3))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null) formData.append(k, v) })
      const { data } = await axios.post("http://localhost:3000/api/restaurant/register", formData,{ withCredentials: true }, {
        headers: { "Content-Type": "multipart/form-data" },
        
      })
      alert(data.message)
      
      navigate("/restaurant/dashbaord");
      
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    }
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("http://localhost:3000/api/restaurant/login",loginForm,{ withCredentials: true } )
      alert(data.message)
      navigate("/restaurant/dashbaord");
    } catch (error) {
      console.error(error)
      alert("Invalid credentials. Please try again.")
      
    }
  }

  return (
    <div className="min-h-screen  from-orange-50 via-white to-amber-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4 shadow-lg shadow-orange-200">
            <FaUtensils className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {isLogin ? "Welcome Back" : "Partner With Us"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? "Sign in to your restaurant account" : "Join our platform and grow your business"}
          </p>
        </div>

        {/* Progress Steps — register only */}
        {!isLogin && (
        <div className="mb-8">
          <div className="flex items-start">
            {STEPS.map((step, idx) => (
              <div key={step.id} className={`flex flex-col items-center ${idx < STEPS.length - 1 ? "flex-1" : ""}`}>
                {/* Circle + connector row */}
                <div className="flex items-center w-full">
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-orange-500 border-orange-500 text-white"
                      : currentStep === step.id
                      ? "bg-white border-orange-500 text-orange-500 shadow-md shadow-orange-100"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}>
                    {currentStep > step.id ? <FaCheckCircle className="text-base" /> : step.id}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${
                      currentStep > step.id ? "bg-orange-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
                {/* Label below circle */}
                <span className={`text-xs mt-1.5 font-medium whitespace-nowrap self-start ml-1 ${
                  currentStep >= step.id ? "text-gray-700" : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-6 sm:p-8">

            {/* ── LOGIN FORM ── */}
            {isLogin && (
              <form onSubmit={loginHandler} className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Enter your credentials to continue</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input type="email" value={loginForm.email}
                      onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                      className={iconInputClass} placeholder="vendor@example.com"
                      maxLength={100} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm outline-none"
                      placeholder="••••••••"  maxLength={64} required
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    </button>
                  </div>
                  <p className="text-right mt-1.5">
                    <span className="text-xs text-orange-500 font-medium cursor-pointer hover:underline">
                      Forgot password?
                    </span>
                  </p>
                </div>

                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-orange-200 transition-all mt-2"
                  
                  >
                    
                   Sign In
                </button>
              </form>
            )}

            {/* ── REGISTER STEPS ── */}
            {!isLogin && (
              <div>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Tell us a bit about yourself</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                          <input type="text" name="firstName" value={form.firstName}
                            onChange={onChangeHandler} className={iconInputClass}
                            placeholder="John" minLength={2} maxLength={30} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                          <input type="text" name="lastName" value={form.lastName}
                            onChange={onChangeHandler} className={iconInputClass}
                            placeholder="Doe" minLength={2} maxLength={30} required />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input type="tel" name="phone" value={form.phone}
                          onChange={onChangeHandler} className={iconInputClass}
                          placeholder="9876543210" minLength={10} maxLength={15} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input type="text" name="address" value={form.address}
                          onChange={onChangeHandler} className={iconInputClass}
                          placeholder="123 Street, City" minLength={5} maxLength={100} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input type="email" name="email" value={form.email}
                          onChange={onChangeHandler} className={iconInputClass}
                          placeholder="vendor@example.com" maxLength={100} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={onChangeHandler}
                          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm outline-none"
                          placeholder="••••••••" minLength={8} maxLength={64} required
                        />
                        <button type="button" onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Restaurant Details */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Restaurant Details</h2>
                      <p className="text-sm text-gray-400 mt-0.5">Tell us about your restaurant</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Restaurant Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input type="text" name="restaurantName" value={form.restaurantName}
                          onChange={onChangeHandler} className={iconInputClass}
                          placeholder="The Gourmet Kitchen" minLength={3} maxLength={60} required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Restaurant Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none z-10" />
                        <select name="restaurantType" value={form.restaurantType}
                          onChange={onChangeHandler}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm outline-none bg-white appearance-none cursor-pointer"
                          required>
                          <option value="">Select type</option>
                          {RESTAURANT_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Opening Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                          <input type="time" name="openingTime" value={form.openingTime}
                            onChange={onChangeHandler} className={iconInputClass} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Closing Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                          <input type="time" name="closingTime" value={form.closingTime}
                            onChange={onChangeHandler} className={iconInputClass} required />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Media Upload */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mt-0.5">Upload your Restaurant image</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Image <span className="text-red-500">*</span>
                      </label>
                      <label className="group cursor-pointer block">
                        <input type="file" name="restaurantImage" accept="image/*"
                          onChange={onChangeHandler} className="hidden" />
                        {imagePreview ? (
                          <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-orange-400 shadow-md">
                            <img src={imagePreview} alt="Logo preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                              <FaCloudUploadAlt className="text-white text-xl" />
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-400 hover:border-orange-400 hover:bg-orange-50 transition-all">
                            <FaImage className="text-3xl" />
                            <span className="text-sm font-medium">Click to upload Image</span>
                            <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                          </div>
                        )}
                      </label>
                    </div>

                    

                   
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className={`flex mt-8 gap-3 ${currentStep > 1 ? "justify-between" : "justify-end"}`}>
                  {currentStep > 1 && (
                    <button type="button" onClick={prevStep}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all">
                      <FaChevronLeft className="text-xs" /> Back
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-orange-200 transition-all">
                      Next <FaChevronRight className="text-xs" />
                    </button>
                  ) : (
                    <form onSubmit={submitHandler}>
                      <button type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-orange-200 transition-all">
                         Submit Registration
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={switchMode} className="text-orange-500 font-medium cursor-pointer hover:underline">
            {isLogin ? "Register" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default RestaurantAuth