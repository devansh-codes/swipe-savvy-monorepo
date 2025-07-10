import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, ArrowRight, User, Mail, Phone, Lock, Building, Link as LinkIcon, X, Home, PartyPopper, ShieldCheck } from 'lucide-react';

// Mock Data
const mockTestimonials = [
  { name: "Sarah L.", business: "The Corner Cafe", quote: "Swipe Savvy was a game-changer for us! We saw a 25% increase in repeat customers in the first month." },
  { name: "Mike R.", business: "Mike's Auto Repair", quote: "The setup was incredibly simple, and our customers love the rewards. The free listing was a no-brainer." },
  { name: "Jessica T.", business: "Bloom & Petal Florist", quote: "Being featured in the app brought in so much new foot traffic. The upgrade was worth every penny." },
];

// Mock API function
const searchBusinesses = async (query) => {
  console.log(`Searching for: ${query}`);
  return new Promise(resolve => {
    setTimeout(() => {
      if (query.toLowerCase().includes('cafe')) {
        resolve({
          name: "The Corner Cafe",
          address: "123 Main St, Anytown, USA",
          phone: "(555) 123-4567",
          imageUrl: `https://placehold.co/600x400/e2e8f0/475569?text=The+Corner+Cafe`,
        });
      } else {
        resolve(null);
      }
    }, 1000);
  });
};

// --- Reusable Components ---
const ProgressBar = ({ currentStep, isNewBusinessFlow }) => {
  const steps = isNewBusinessFlow ? ["Register", "Create Account", "Terms", "Done!"] : ["Find Business", "Verify", "Create Account", "Terms", "Done!"];
  const actualStep = isNewBusinessFlow ? currentStep - 1 : currentStep;
  return (
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepIndex = index + 1;
            const isActive = stepIndex <= actualStep;
            const isCompleted = stepIndex < actualStep;
            return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {isCompleted ? <CheckCircle size={24} /> : stepIndex}
                    </div>
                    <p className={`mt-2 text-xs md:text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{step}</p>
                  </div>
                  {stepIndex < steps.length && <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                </React.Fragment>
            );
          })}
        </div>
      </div>
  );
};

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
      <div className="relative w-full max-w-3xl mx-auto h-32 overflow-hidden">
        {mockTestimonials.map((testimonial, index) => (
            <div key={index} className={`absolute w-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-center text-lg italic text-white/80">"{testimonial.quote}"</p>
              <p className="text-center text-md font-semibold text-white mt-2">- {testimonial.name}, {testimonial.business}</p>
            </div>
        ))}
      </div>
  );
};

const InputField = ({ id, name, type, placeholder, icon, value, onChange, error }) => (
    <div className="mb-4">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
        <input id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} className={`w-full pl-10 pr-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

// --- Step Components ---
const HeroStep = ({ onNext, onRegisterNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      setError('Please enter a business name or phone number.');
      return;
    }
    setIsLoading(true);
    setError('');
    const business = await searchBusinesses(searchTerm);
    setIsLoading(false);
    if (business) {
      onNext({ business });
    } else {
      setError('We couldn\'t find a business with that name.');
    }
  };
  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat p-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full text-white">
          <main className="text-center bg-black/30 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl border border-white/20 max-w-3xl">
            <img src="https://placehold.co/150x50/ffffff/000000?text=Swipe+Savvy" alt="Swipe Savvy Logo" className="mx-auto mb-6 rounded" />
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">Grow Your Business with a <span className="text-blue-400">Free Loyalty Listing</span></h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 mb-8">Join the Swipe Savvy Rewards Network completely free. Start by finding your business or registering a new one.</p>
            <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
              <div className="relative">
                <input id="business-search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Enter your business name or phone number" className="w-full pl-4 pr-14 py-4 text-lg text-gray-800 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all" />
                <button type="submit" disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all disabled:bg-gray-400">
                  {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search size={24} />}
                </button>
              </div>
              {error && (
                  <div className="mt-4 text-center">
                    <p className="text-red-400 text-sm">{error}</p>
                    <button type="button" onClick={onRegisterNew} className="mt-3 text-blue-300 font-semibold hover:text-white underline">
                      Can't find it? Register your business now.
                    </button>
                  </div>
              )}
              <p className="mt-4 text-sm text-white/70">We'll find your business and you can confirm the correct one in the next step.</p>
            </form>
          </main>
        </div>
        <div className="relative z-10 w-full py-8"><TestimonialCarousel /></div>
      </div>
  );
};

const VerificationStep = ({ onNext, onBack, data }) => {
  const { business } = data;
  if (!business) return <div className="flex flex-col items-center justify-center min-h-screen p-4"><p className="text-red-500">Error: Business data is missing.</p><button onClick={onBack} className="mt-4 px-6 py-2 bg-gray-300 rounded-lg">Go Back</button></div>;
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-2xl">
          <ProgressBar currentStep={2} />
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Is This Your Business?</h2>
            <p className="text-gray-600 mb-8">We found the following match for your entry. Please confirm before proceeding.</p>
            <div className="bg-gray-100 rounded-xl p-6 border text-left flex flex-col md:flex-row items-center gap-6">
              <img src={business.imageUrl} alt={business.name} className="w-32 h-32 object-cover rounded-lg shadow-md flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/e2e8f0/475569?text=Image+Not+Found`; }} />
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{business.name}</h3>
                <p className="text-gray-600 mt-2">{business.address}</p>
                <p className="text-gray-600 mt-1">{business.phone}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onBack} className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all">No, Try Again</button>
              <button onClick={() => onNext()} className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">Yes, This Is Me <ArrowRight size={20} /></button>
            </div>
          </div>
        </div>
      </div>
  );
};

const AccountCreationStep = ({ onNext, onBack, isNewBusinessFlow }) => {
  const [formData, setFormData] = useState({ businessName: '', businessAddress: '', fullName: '', email: '', mobile: '', password: '', website: '', isOwner: false });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const validate = () => {
    const newErrors = {};
    if (isNewBusinessFlow && !formData.businessName) newErrors.businessName = "Business name is required.";
    if (isNewBusinessFlow && !formData.businessAddress) newErrors.businessAddress = "Business address is required.";
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required.";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (!formData.isOwner) newErrors.isOwner = "You must confirm you are the owner or representative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = { user: formData };
      if (isNewBusinessFlow) {
        payload.business = { name: formData.businessName, address: formData.businessAddress, phone: formData.mobile, imageUrl: `https://placehold.co/600x400/e2e8f0/475569?text=${formData.businessName.replace(/\s/g, '+')}` };
      }
      onNext(payload);
    }
  };
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-4xl">
          <ProgressBar currentStep={isNewBusinessFlow ? 2 : 3} isNewBusinessFlow={isNewBusinessFlow} />
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Your Swipe Savvy Account</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {isNewBusinessFlow && (
                    <>
                      <h3 className="md:col-span-2 text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Business Details</h3>
                      <InputField id="businessName" name="businessName" type="text" placeholder="Business Name" icon={<Building size={20} />} value={formData.businessName} onChange={handleChange} error={errors.businessName} />
                      <InputField id="businessAddress" name="businessAddress" type="text" placeholder="Business Address" icon={<Home size={20} />} value={formData.businessAddress} onChange={handleChange} error={errors.businessAddress} />
                      <div className="md:col-span-2 mb-4"></div>
                    </>
                )}
                <h3 className="md:col-span-2 text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Details</h3>
                <InputField id="fullName" name="fullName" type="text" placeholder="Full Name" icon={<User size={20} />} value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                <InputField id="email" name="email" type="email" placeholder="Email Address" icon={<Mail size={20} />} value={formData.email} onChange={handleChange} error={errors.email} />
                <InputField id="mobile" name="mobile" type="tel" placeholder="Mobile Number" icon={<Phone size={20} />} value={formData.mobile} onChange={handleChange} error={errors.mobile} />
                <InputField id="password" name="password" type="password" placeholder="Password" icon={<Lock size={20} />} value={formData.password} onChange={handleChange} error={errors.password} />
                <div className="md:col-span-2"><InputField id="website" name="website" type="url" placeholder="Website or Social Link (Optional)" icon={<LinkIcon size={20} />} value={formData.website} onChange={handleChange} error={errors.website} /></div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input type="checkbox" name="isOwner" checked={formData.isOwner} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-3 text-gray-700">I am the owner or authorized representative of this business.</span>
                </label>
                {errors.isOwner && <p className="text-red-500 text-xs mt-1">{errors.isOwner}</p>}
              </div>
              <div className="mt-8 flex justify-between items-center">
                <button type="button" onClick={onBack} className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all">Back</button>
                <button type="submit" className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">Continue <ArrowRight size={20} /></button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

const TermsStep = ({ onNext, onBack, isNewBusinessFlow }) => {
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-4xl">
          <ProgressBar currentStep={isNewBusinessFlow ? 3 : 4} isNewBusinessFlow={isNewBusinessFlow} />
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Just One More Step</h2>
                <p className="text-gray-600 mb-6">Please review and agree to our terms before activating your account.</p>
                <div className="border rounded-lg p-4">
                  <button onClick={() => setShowTerms(!showTerms)} className="w-full text-left font-semibold text-blue-600 flex justify-between items-center">
                    <span>Merchant Agreement & Privacy Policy</span>
                    <span className={`transform transition-transform ${showTerms ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {showTerms && (
                      <div className="mt-4 text-sm text-gray-600 h-48 overflow-y-auto pr-2">
                        <h4 className="font-bold mb-2">Merchant Agreement Summary</h4>
                        <p className="mb-2">This Agreement contains the terms and conditions that apply to your participation in the Swipe Savvy Network...</p>
                        <h4 className="font-bold mt-4 mb-2">Privacy Policy Summary</h4>
                        <p>We are committed to protecting your privacy. This policy outlines how we collect, use, and protect your information...</p>
                      </div>
                  )}
                </div>
                <div className="mt-6">
                  <label className="flex items-center">
                    <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-3 text-gray-700">I have read and agree to the Swipe Savvy Merchant Agreement and Privacy Policy.</span>
                  </label>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <button onClick={onBack} className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-all">Back</button>
                  <button onClick={() => onNext()} disabled={!agreed} className="px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">Activate My Free Listing <CheckCircle size={20} /></button>
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center lg:text-right">We'll ship your Swipe Savvy window sticker and POS signage within 5-7 business days.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Your Free Plan Includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} /><span>A live listing in the Swipe Savvy network.</span></li>
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} /><span>Free window sticker & POS signage.</span></li>
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} /><span>A reward-enabled checkout process.</span></li>
                  <li className="flex items-start"><CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} /><span>Basic analytics on customer visits.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

const SuccessStep = ({ data, isNewBusinessFlow }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [finalMessage, setFinalMessage] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  const handleUpgrade = () => setFinalMessage("Great choice! In a real app, you would now be redirected to our secure payment page.");
  const handleNoThanks = () => setFinalMessage("No problem! Your free account is all set. In a real app, you would now be taken to your merchant dashboard.");
  if (finalMessage) {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
            <PartyPopper className="mx-auto text-blue-500 h-20 w-20 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600">{finalMessage}</p>
          </div>
        </div>
    )
  }
  return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative overflow-hidden">
        {showConfetti && <div className="absolute inset-0 pointer-events-none">{[...Array(100)].map((_, i) => <div key={i} className="absolute rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * -50}%`, width: `${Math.random() * 10 + 5}px`, height: `${Math.random() * 10 + 5}px`, backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)], animation: `confetti-fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite` }} />)}</div>}
        <style>{`@keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(150vh) rotate(720deg); opacity: 0; } }`}</style>
        <div className="max-w-5xl mx-auto text-center">
          <ProgressBar currentStep={isNewBusinessFlow ? 4 : 5} isNewBusinessFlow={isNewBusinessFlow} />
          <ShieldCheck className="mx-auto text-green-500 h-20 w-20 mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Your Business Is Now Live on Swipe Savvy!</h1>
          <p className="mt-4 text-lg text-gray-600">Congratulations, {data.user.fullName}! {data.business.name} is now part of our rewards network.</p>
          <div className="mt-10 bg-blue-600/10 p-6 md:p-10 rounded-2xl border-2 border-dashed border-blue-600">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">LIMITED-TIME OFFER: Upgrade to Shop Savvy</h2>
            <p className="mt-2 text-gray-700">Make the most of your listing with this exclusive offer for new members.</p>
            <p className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">Try it FREE for 30 days, then just <span className="text-blue-600">$34.50/mo</span></p>
            <p className="text-lg font-semibold text-gray-600">(That's 50% off for life!)</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold text-gray-800">Your Active <span className="text-green-600">Free Plan</span></h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2" /> Live Listing</li>
                  <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2" /> POS Signage</li>
                  <li className="flex items-center"><X size={18} className="text-red-500 mr-2" /> Featured Placement</li>
                  <li className="flex items-center"><X size={18} className="text-red-500 mr-2" /> Run 2x Rewards</li>
                  <li className="flex items-center"><X size={18} className="text-red-500 mr-2" /> Sync with Google, Yelp</li>
                  <li className="flex items-center"><X size={18} className="text-red-500 mr-2" /> Advanced Analytics</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-500 relative">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">BEST VALUE</div>
                <h3 className="text-xl font-bold text-blue-800">Upgrade to <span className="text-blue-600">Shop Savvy</span></h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2" /> Everything in Free, plus:</li>
                  <li className="flex items-center font-semibold text-blue-700"><CheckCircle size={18} className="text-green-500 mr-2" /> Featured Placement</li>
                  <li className="flex items-center font-semibold text-blue-700"><CheckCircle size={18} className="text-green-500 mr-2" /> Run 2x Rewards</li>
                  <li className="flex items-center font-semibold text-blue-700"><CheckCircle size={18} className="text-green-500 mr-2" /> Sync with Google, Yelp</li>
                  <li className="flex items-center font-semibold text-blue-700"><CheckCircle size={18} className="text-green-500 mr-2" /> Advanced Analytics</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleNoThanks} className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-gray-700 bg-transparent rounded-full hover:bg-gray-200 transition-all">No Thanks, I'll Stay on the Free Plan</button>
              <button onClick={handleUpgrade} className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">Yes, Upgrade Me Risk-Free</button>
            </div>
          </div>
        </div>
      </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [step, setStep] = useState(1);
  const [appData, setAppData] = useState({});
  const [isNewBusinessFlow, setIsNewBusinessFlow] = useState(false);
  const handleNext = (newData = {}) => {
    setAppData(prev => ({ ...prev, ...newData }));
    setStep(prev => prev + 1);
  };
  const handleBack = () => {
    if (isNewBusinessFlow && step === 3) {
      handleReset();
      return;
    }
    setStep(prev => prev - 1);
  };
  const handleReset = () => {
    setStep(1);
    setAppData({});
    setIsNewBusinessFlow(false);
  }
  const handleRegisterNew = () => {
    setIsNewBusinessFlow(true);
    setStep(3);
  };
  const renderStep = () => {
    switch (step) {
      case 1: return <HeroStep onNext={handleNext} onRegisterNew={handleRegisterNew} />;
      case 2: return <VerificationStep onNext={handleNext} onBack={handleBack} data={appData} />;
      case 3: return <AccountCreationStep onNext={handleNext} onBack={handleBack} isNewBusinessFlow={isNewBusinessFlow} />;
      case 4: return <TermsStep onNext={handleNext} onBack={handleBack} isNewBusinessFlow={isNewBusinessFlow} />;
      case 5: return <SuccessStep data={appData} isNewBusinessFlow={isNewBusinessFlow} />;
      default: return <HeroStep onNext={handleNext} />;
    }
  };
  return (
      <>
        {renderStep()}
        {/* This button is for development/testing to easily reset the flow */}
        {step > 1 && step < 5 && <button onClick={handleReset} className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 transition-all z-50">Reset Flow</button>}
      </>
  );
}
