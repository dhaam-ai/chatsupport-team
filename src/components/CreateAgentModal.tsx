import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Check,
  Camera,
  Building,
} from 'lucide-react';
import CustomDropdown from './CustomDropDown';

interface Department {
  id: number;
  department_name: string;
  app_id: string;
  created_at: string;
  updated_at: string;
}

interface DropdownItem {
  id: number | string;
  name: string;
  email?: string;
  avatar?: string;
  status?: string;
  [key: string]: any;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  selectedItem: DropdownItem | null;
  onSelect: (item: DropdownItem) => void;
  onSearch: (query: string) => void;
  searchValue: string;
  loading: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  showSearch?: boolean;
}

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  apiClient: any;
  CustomDropdown: React.ComponentType<CustomDropdownProps>;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  apiClient,
  CustomDropdown
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact_number: '',
    address: '',
    department_id: null as number | null,
    profile_picture: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const APP_ID = '12345';

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen && departments.length === 0) {
      console.log('[CreateAgentModal] Fetching departments...');
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      console.log('[CreateAgentModal] Calling department API...');
      const response = await apiClient.post('/agent-department/list', {
        app_id: APP_ID,
      });
      console.log('[CreateAgentModal] Department API response:', response);
      
      if (response.success && response.data?.departments) {
        console.log('[CreateAgentModal] Departments loaded:', response.data.departments);
        setDepartments(response.data.departments);
      } else {
        console.error('[CreateAgentModal] Failed to fetch departments:', response);
      }
    } catch (error) {
      console.error('[CreateAgentModal] Department fetch error:', error);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setFormData(prev => ({ ...prev, profile_picture: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.username.trim()) newErrors.username = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.contact_number.trim()) newErrors.contact_number = 'Phone number is required';
    }
    
    if (step === 2) {
      if (!formData.department_id) newErrors.department_id = 'Department is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      contact_number: '',
      address: '',
      department_id: null,
      profile_picture: '',
    });
    setAvatarPreview(null);
    setCurrentStep(1);
    setErrors({});
    setDepartmentSearch('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      console.log('[CreateAgentModal] Creating agent with payload:', {
        app_id: APP_ID,
        username: formData.username,
        email: formData.email,
        contact_number: formData.contact_number,
        address: formData.address,
        department_id: formData.department_id,
      });

      const response = await apiClient.post('/agent/create', {
        app_id: APP_ID,
        username: formData.username,
        email: formData.email,
        contact_number: formData.contact_number,
        address: formData.address,
        department_id: formData.department_id,
        profile_picture: formData.profile_picture || 'default_profile.png',
      });

      console.log('[CreateAgentModal] Create agent response:', response);

      if (response.success) {
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrors({ submit: response.error || 'Failed to create agent' });
      }
    } catch (error: any) {
      console.error('[CreateAgentModal] Create agent error:', error);
      setErrors({ submit: error?.message || 'Failed to create agent' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredDepartments = departments.filter(dept =>
    dept.department_name.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  const departmentItems = filteredDepartments.map(dept => ({
    id: dept.id,
    name: dept.department_name,
  }));

  const selectedDepartment = formData.department_id
    ? departmentItems.find(item => item.id === formData.department_id)
    : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full lg:max-w-3xl sm:max-w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 lg:px-6 lg:py-5 sm:px-4 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
          <div>
            <h3 className="text-xl lg:text-xl sm:text-lg font-bold text-gray-900">Create New Agent</h3>
            <p className="text-sm text-gray-600 mt-0.5">Fill in the details to add a new team member</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: 'Personal' },
              { num: 2, label: 'Work' },
              { num: 3, label: 'Review' }
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all ${
                    currentStep >= step.num 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${
                    currentStep >= step.num ? 'text-purple-600' : 'text-gray-500'
                  }`}>{step.label}</span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-0.5 transition-all ${
                    currentStep > step.num ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  Personal Information
                </h4>
                
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-purple-300" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 shadow-lg transition-all hover:scale-110">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all ${
                        errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="agent@company.com"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all ${
                        errors.contact_number ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.contact_number && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.contact_number}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Work Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  Work Details
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <CustomDropdown
                      label="Department"
                      required
                      items={departmentItems}
                      selectedItem={selectedDepartment || null}
                      onSelect={(item) => {
                        console.log('[CreateAgentModal] Department selected:', item);
                        setFormData(prev => ({ ...prev, department_id: item.id as number }));
                        if (errors.department_id) {
                          const newErrors = { ...errors };
                          delete newErrors.department_id;
                          setErrors(newErrors);
                        }
                      }}
                      onSearch={setDepartmentSearch}
                      searchValue={departmentSearch}
                      loading={departmentsLoading}
                      placeholder="Select a department"
                      showSearch={false}
                    />
                    {errors.department_id && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.department_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street, New York, NY 10001"
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all resize-none ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  Review Information
                </h4>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                  <div className="space-y-4">
                    {avatarPreview && (
                      <div className="flex justify-center mb-4">
                        <img src={avatarPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 block mb-1">Name</span>
                        <span className="font-semibold text-gray-900">{formData.username || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">Email</span>
                        <span className="font-semibold text-gray-900 break-all">{formData.email || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">Phone</span>
                        <span className="font-semibold text-gray-900">{formData.contact_number || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">Department</span>
                        <span className="font-semibold text-gray-900">{selectedDepartment?.name || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600 block mb-1">Address</span>
                        <span className="font-semibold text-gray-900">{formData.address || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {currentStep === 3 && 'Review the information before creating'}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={currentStep === 1 ? handleClose : handleBack}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create Agent
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentModal;