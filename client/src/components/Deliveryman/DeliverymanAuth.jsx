

import { useState } from "react"
import axios from "axios"
import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaMotorcycle, FaIdCard, FaMapMarkerAlt, FaCalendarAlt,
  FaClock, FaImage, FaCheckCircle, FaChevronRight,
  FaChevronLeft, FaCloudUploadAlt, FaFileAlt
} from "react-icons/fa"

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Delivery" },
  { id: 3, label: "Account" },
]

const IDENTITY_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "national_id", label: "National ID" },
]

const ZONES = [
  { value: "pokhara", label: "Pokhara" },
  { value: "kathmandu", label: "Kathmandu" },
  { value: "lalitpur", label: "Lalitpur" },
]

const VEHICLES = [
  { value: "bike", label: "Bike" },
  { value: "scooty", label: "Scooty" },
  { value: "bicycle", label: "Bicycle" },
]

const DUTY_TIMES = [
  { value: "day", label: "Day Shift", sub: "12 PM – 8 PM" },
  { value: "evening", label: "Evening Shift", sub: "6 PM – 2 AM" },
]

const inputBase =
  "w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm outline-none"

const selectBase =
  "w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm outline-none appearance-none cursor-pointer"

const labelClass = "block text-sm font-medium text-gray-300 mb-1.5"

const FileUpload = ({ name, preview, icon: Icon, label, hint, onChange }) => (
  <div>
    <p className={labelClass}>{label} <span className="text-red-400">*</span></p>
    <label className="group cursor-pointer block">
      <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
      {preview ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-teal-500 shadow-lg shadow-teal-900/30">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <FaCloudUploadAlt className="text-white text-2xl" />
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center gap-2 text-gray-500 hover:border-teal-500 hover:bg-teal-950/20 transition-all">
          <Icon className="text-2xl text-gray-400" />
          <span className="text-sm font-medium text-gray-400">Click to upload</span>
          <span className="text-xs text-gray-500">{hint}</span>
        </div>
      )}
    </label>
  </div>
)

const DeliverymanAuth = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)

  // File previews
  const [identityPreview, setIdentityPreview] = useState(null)
  const [billBookPrview, setbillBookPrview] = useState(null)
  const [deliverymanPreview, setDeliverymanPreview] = useState(null)

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", dateOfBirth: "",
    identityType: "", identityImage: null,
    zone: "", vehicle: "", billBookCopy: null, dutyTime: "",
    deliverymanImage: null, email: "", password: "",
  })

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const switchMode = () => {
    setIsLogin(p => !p)
    setCurrentStep(1)
    setShowPassword(false)
  }

  const onChangeHandler = (e) => {
    const { name, value, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      set(name, file)
      const url = URL.createObjectURL(file)
      if (name === "identityImage") setIdentityPreview(url)
      if (name === "billBookCopy") setbillBookPrview(url)
      if (name === "deliverymanImage") setDeliverymanPreview(url)
    } else {
      set(name, value)
    }
  }

  const toggleDutyTime = (val) => {
    set("dutyTime", form.dutyTime === val ? "" : val)
  }

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 3))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== "") formData.append(k, v) })
      const { data } = await axios.post("http://localhost:3000/api/deliveryman/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert(data.message)
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    }
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("http://localhost:3000/api/deliveryman/login", loginForm)
      alert(data.message)
    } catch (error) {
      console.error(error)
      alert("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4 shadow-lg shadow-teal-500/30">
            <FaMotorcycle className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {isLogin ? "Welcome Back" : "Join as Rider"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? "Sign in to your delivery account" : "Apply to become a delivery partner"}
          </p>
        </div>

        {/* Progress Steps — register only */}
        {!isLogin && (
          <div className="mb-8">
            <div className="flex items-start">
              {STEPS.map((step, idx) => (
                <div key={step.id} className={`flex flex-col items-center ${idx < STEPS.length - 1 ? "flex-1" : ""}`}>
                  <div className="flex items-center w-full">
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-teal-500 border-teal-500 text-white"
                        : currentStep === step.id
                        ? "bg-gray-900 border-teal-400 text-teal-400 shadow-md shadow-teal-900/50"
                        : "bg-gray-900 border-gray-700 text-gray-600"
                    }`}>
                      {currentStep > step.id ? <FaCheckCircle className="text-base" /> : step.id}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${
                        currentStep > step.id ? "bg-teal-500" : "bg-gray-700"
                      }`} />
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium whitespace-nowrap self-start ml-1 ${
                    currentStep >= step.id ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-6 sm:p-8">

          {/* ── LOGIN FORM ── */}
          {isLogin && (
            <form onSubmit={loginHandler} className="space-y-5">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Sign In</h2>
                <p className="text-sm text-gray-500 mt-0.5">Enter your credentials to continue</p>
              </div>

              <div>
                <label className={labelClass}>Email <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                  <input type="email" value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    className={inputBase} placeholder="rider@example.com" maxLength={100} required />
                </div>
              </div>

              <div>
                <label className={labelClass}>Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm outline-none"
                    placeholder="••••••••" minLength={8} maxLength={64} required
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                <p className="text-right mt-1.5">
                  <span className="text-xs text-teal-400 font-medium cursor-pointer hover:underline">Forgot password?</span>
                </p>
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-sm font-semibold shadow-lg shadow-teal-900/40 transition-all mt-2">
                <FaCheckCircle className="text-sm" /> Sign In
              </button>
            </form>
          )}

          {/* ── REGISTER STEPS ── */}
          {!isLogin && (
            <form onSubmit={submitHandler}>

              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Personal Information</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Tell us about yourself</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                        <input type="text" name="firstName" value={form.firstName}
                          onChange={onChangeHandler} className={inputBase}
                          placeholder="First Name" minLength={2} maxLength={30} required />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Last Name <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                        <input type="text" name="lastName" value={form.lastName}
                          onChange={onChangeHandler} className={inputBase}
                          placeholder="Last Name" minLength={2} maxLength={30} required />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Phone <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input type="tel" name="phone" value={form.phone}
                        onChange={onChangeHandler} className={inputBase}
                        placeholder="9876543210" minLength={10} maxLength={15} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
                      <input type="date" name="dateOfBirth" value={form.dateOfBirth}
                        onChange={onChangeHandler} className={inputBase} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Identity Type <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none z-10" />
                      <select name="identityType" value={form.identityType}
                        onChange={onChangeHandler} className={selectBase} required>
                        <option value="">Select identity type</option>
                        {IDENTITY_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <FileUpload
                    name="identityImage"
                    preview={identityPreview}
                    icon={FaIdCard}
                    label="Identity Image"
                    hint="Clear photo of your ID document"
                    onChange={onChangeHandler}
                  />
                </div>
              )}

              {/* Step 2: Delivery Details */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Delivery Details</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Your zone, vehicle and availability</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Zone <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none z-10" />
                        <select name="zone" value={form.zone}
                          onChange={onChangeHandler} className={selectBase} required>
                          <option value="">Select zone</option>
                          {ZONES.map(z => (
                            <option key={z.value} value={z.value}>{z.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Vehicle <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <FaMotorcycle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none z-10" />
                        <select name="vehicle" value={form.vehicle}
                          onChange={onChangeHandler} className={selectBase} required>
                          <option value="">Select vehicle</option>
                          {VEHICLES.map(v => (
                            <option key={v.value} value={v.value}>{v.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <FileUpload
                    name="billBookCopy"
                    preview={billBookPrview}
                    icon={FaFileAlt}
                    label="Billbook Scan Copy"
                    hint="Scanned copy of vehicle billbook"
                    onChange={onChangeHandler}
                  />

                  <div>
                    <label className={labelClass}>Duty Time <span className="text-red-400">*</span></label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      {DUTY_TIMES.map(dt => (
                        <button key={dt.value} type="button"
                          onClick={() => toggleDutyTime(dt.value)}
                          className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 transition-all text-left ${
                            form.dutyTime === dt.value
                              ? "border-teal-500 bg-teal-950/40 text-teal-300"
                              : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                          }`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <FaClock className="text-xs" />
                            <span className="text-sm font-semibold">{dt.label}</span>
                          </div>
                          <span className="text-xs opacity-70">{dt.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FileUpload
                    name="deliverymanImage"
                    preview={deliverymanPreview}
                    icon={FaImage}
                    label="Your Photo"
                    hint="Clear front-facing photo"
                    onChange={onChangeHandler}
                  />
                </div>
              )}

              {/* Step 3: Account Info */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Account Setup</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Create your login credentials</p>
                  </div>

                  <div>
                    <label className={labelClass}>Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input type="email" name="email" value={form.email}
                        onChange={onChangeHandler} className={inputBase}
                        placeholder="rider@example.com" maxLength={100} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" value={form.password}
                        onChange={onChangeHandler}
                        className="w-full pl-10 pr-12 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm outline-none"
                        placeholder="••••••••" minLength={8} maxLength={64} required
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                        {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mt-2">
                    <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-3">Application Summary</p>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="text-gray-200">{form.firstName} {form.lastName || "—"}</span>
                      <span className="text-gray-500">Phone</span>
                      <span className="text-gray-200">{form.phone || "—"}</span>
                      <span className="text-gray-500">Zone</span>
                      <span className="text-gray-200 capitalize">{form.zone || "—"}</span>
                      <span className="text-gray-500">Vehicle</span>
                      <span className="text-gray-200 capitalize">{form.vehicle || "—"}</span>
                      <span className="text-gray-500">Duty</span>
                      <span className="text-gray-200 capitalize">{form.dutyTime || "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className={`flex mt-8 gap-3 ${currentStep > 1 ? "justify-between" : "justify-end"}`}>
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 text-gray-400 text-sm font-medium hover:bg-gray-800 transition-all">
                    <FaChevronLeft className="text-xs" /> Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-sm font-semibold shadow-lg shadow-teal-900/40 transition-all">
                    Next <FaChevronRight className="text-xs" />
                  </button>
                ) : (
                  <button type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-lg text-sm font-semibold shadow-lg shadow-teal-900/40 transition-all">
                    <FaCheckCircle className="text-sm" /> Submit Application
                  </button>
                )}
              </div>

            </form>
          )}

        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={switchMode}
            className="text-teal-400 font-medium cursor-pointer hover:underline">
            {isLogin ? "Apply Now" : "Sign in"}
          </span>
        </p>

      </div>
    </div>
  )
}

export default DeliverymanAuth
