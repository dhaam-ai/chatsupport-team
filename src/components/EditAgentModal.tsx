import React, { useState, useEffect } from 'react';
import { X, Loader, Save, User, Mail, Phone, MapPin, Building2, AlertCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentData {
  agent_id?: number | string;
  id?: number;
  username?: string;
  name?: string;
  full_name?: string;
  email?: string;
  contact_number?: string;
  phone?: string;
  address?: string;
  location?: string;
  profile_picture?: string;
  avatar?: string;
  department_id?: number;
  department_name?: string;
  account_status?: string;
  status?: string;
}

interface EditAgentModalProps {
  agent: AgentData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedAgent: Partial<AgentData>) => Promise<void>;
  appId: string;
}

/* ----------------------------- Avatar Component ----------------------------- */
const AvatarBadge = ({ name, imageUrl, size = 'md' }: { name?: string; imageUrl?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl'
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBgColor = (name?: string) => {
    if (!name) return 'bg-gray-400';
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
      'bg-yellow-500', 'bg-red-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (imageUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${getBgColor(name)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
};

  // 'active': 'bg-green-50 text-green-800 border border-green-200',
  //     'block': 'bg-red-50 text-red-800 border border-red-200',
  //     'blocked': 'bg-red-50 text-red-800 border border-red-200',
  //     'inactive': 'bg-blue-50 text-blue-800 border border-blue-200'
/* ----------------------------- Status Badge ----------------------------- */
const StatusBadge = ({ status }: { status?: string }) => {
  const statusConfig: Record<string, { bg: string;   }> = {
    active: { bg: 'bg-green-50 text-green-800 border border-green-200',  },
    inactive: { bg: 'bg-blue-50 text-blue-800 border border-blue-200',  },
    block: { bg: 'bg-red-50 text-red-800 border border-red-200', },
  };

  const normalized = (status || 'active').toLowerCase();
  const config = statusConfig[normalized] || statusConfig.active;

  return (
    <span className={`px-2 py-0.5 rounded-full text-[14px] font-bold tracking-wider shadow-sm ${config.bg} `}>
      <span></span>
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
};

/* ---------------------------- Main Component ----------------------------- */
import React, { useState, useEffect } from 'react';
import { X, Loader, Save, User, Mail, Phone, MapPin, Building2, AlertCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ... (AvatarBadge, StatusBadge, and Interfaces remain identical to your original code)

const EditAgentModal: React.FC<EditAgentModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSave,
  appId,
}) => {
  const [formData, setFormData] = useState<Partial<AgentData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  useEffect(() => {
    if (agent && isOpen) {
      setFormData({
        id: agent.id,
        agent_id: agent.agentId || agent.id,
        username: agent.name,
        email: agent.email,
        contact_number: agent.phone|| '',
        address: agent.address || '',
        profile_picture: agent.profile_picture || '',
      
      });
      setProfileImagePreview(agent.profile_picture || '');
      setHasChanges(false);
    }
  }, [agent, isOpen]);

  const handleChange = (field: keyof AgentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return onClose();
    setIsLoading(true);
    try {
      const payload = {
        app_id: appId,
        agent_id: formData.agent_id || formData.id || 0,
        username: formData.username || '',
        email: formData.email || '',
        contact_number: formData.contact_number || '',
        address: formData.address || '',
        profile_picture: formData.profile_picture || '',
     
      };
      await onSave?.(payload);
      onClose();
    } catch (e: any) {
      console.error('Save error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && agent && (
        <>
          {/* Backdrop with Fade Exit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-90"
          />

          {/* Side Drawer with Slide Exit */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'tween', 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1] // Professional cubic-bezier for smoother feel
            }}
            style={{
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
            }}
            className="fixed right-0 top-0 h-full w-full max-w-xl lg:max-w-xl sm:max-w-full bg-white z-100 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header - ORIGINAL UI */}
            <div className="px-6 py-3.5 lg:px-6 lg:py-3.5 sm:px-4 sm:py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-base lg:text-base sm:text-sm font-semibold text-gray-900">Edit Agent</h2>
                  <StatusBadge status={agent.account_status} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{agent.name || agent.full_name || agent.username}</p>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content - ORIGINAL UI */}
            <div className="flex-1 overflow-y-auto">
              {/* Profile Picture Section */}
              <div className="px-6 py-5 border-b border-gray-100 bg-white">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Camera className="w-3.5 h-3.5" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-4">
                     <AvatarBadge 
                    name={agent.name || agent.full_name || agent.username} 
                    imageUrl={profileImagePreview} 
                    size="lg" 
                  />
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                      <Camera className="w-4 h-4" />
                      Upload Photo
                      <input type="file" accept="image/*" onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => {
                                 setProfileImagePreview(reader.result as string);
                                 handleChange('profile_picture', reader.result);
                             };
                             reader.readAsDataURL(file);
                         }
                      }} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="px-6 py-5 border-b border-gray-100 space-y-4">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Agnet  Information
                </h3>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Username</label>
                  <input
                    value={formData.username || ''}
                    onChange={e => handleChange('username', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-purple-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => handleChange('email', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-purple-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" /> Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_number || ''}
                    onChange={e => handleChange('contact_number', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-purple-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" /> Address
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address || ''}
                    onChange={e => handleChange('address', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-purple-400 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Contact Info Section */}
             

              {/* Department Section */}
              <div className="px-6 py-5 border-b border-gray-100 space-y-4">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Department
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                   <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Current Department</p>
                      <p className="font-semibold text-gray-900">{agent.department_name || `Department #${agent.department_id}`}</p>
                   </div>
                   <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Department ID</label>
                  <input
                    type="number"
                    // value={formData.department_id || ''}
                    // onChange={e => handleChange('department_id', parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:ring-1 focus:ring-purple-400 outline-none"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="mx-6 my-5 p-4 bg-purple-50 border border-purple-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">Important</p>
                  <p className="text-xs text-purple-800 leading-relaxed">Changes will be saved to the agent profile. Ensure all information is accurate before saving.</p>
                </div>
              </div>
            </div>

            {/* Footer - ORIGINAL UI */}
            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isLoading}
                className="px-5 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditAgentModal;