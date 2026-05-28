import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {FilterIcon} from "../../../public/assets/svg"

type FilterDropdownProps = {
  onApplyFilters?: (filters: { status: string[]; priority: string[]; category: any[] }) => void;
  onClearFilters?: () => void;
  statuses?: string[];
  priorities?: Array<{ value: string | number; label: string }>;
  categories?: Array<{ value: number; label: string }>;
  activeTab?: string;
};

const FilterDropdown = ({ 
  onApplyFilters = () => {}, 
  onClearFilters = () => {},
  statuses = [], 
  priorities = [], 
  categories = [],
  activeTab = 'all'
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    status: false,
    priority: false,
    category: false
  });
  
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string[];
    priority: (string | number)[];
    category: number[];
  }>({
    status: [],
    priority: [],
    category: []
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Build options from Redux store data - format from TicketSystem
  const statusOptions = useMemo(() => {
    return (statuses || []).map((s) => ({ 
      value: s, 
      label: s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')
    }));
  }, [statuses]);

  const priorityOptions = useMemo(() => {
    return priorities || [];
  }, [priorities]);

  const categoryOptions = useMemo(() => {
    return categories || [];
  }, [categories]);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleCheckboxChange = useCallback((filterType: keyof typeof selectedFilters, value: string | number) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value as any)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value as any];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedFilters({ status: [], priority: [], category: [] });
    onClearFilters();
    setIsOpen(false);
  }, [onClearFilters]);

  const handleApplyFilter = useCallback(() => {
    onApplyFilters(selectedFilters);
    setIsOpen(false);
  }, [onApplyFilters, selectedFilters]);

  const getActiveFilterCount = useMemo(() => Object.values(selectedFilters).flat().length, [selectedFilters]);

  // Improved Framer Motion Variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const sectionVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1]
        },
        opacity: {
          duration: 0.2,
          ease: [0.4, 0, 1, 1]
        }
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1]
        },
        opacity: {
          duration: 0.2,
          ease: [0, 0, 0.2, 1],
          delay: 0.1
        }
      }
    }
  };

  const checkboxVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
      >
        <FilterIcon></FilterIcon>
        FILTER
        <AnimatePresence mode="wait">
          {getActiveFilterCount > 0 && (
            <motion.span
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="ml-1 px-2 py-0.5 text-xs font-bold text-white bg-purple-600 rounded-full"
            >
              {getActiveFilterCount}
            </motion.span>
          )}
        </AnimatePresence>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Filters Heading */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="px-4 py-3 border-b border-gray-200 bg-gray-50"
            >
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            </motion.div>

            {/* Filter Sections */}
            <div className="max-h-[400px] premium-scrollbar overflow-y-auto">
              {/* Status Filter - Only show if statuses exist AND on "all" tab */}
              {statusOptions.length > 0 && activeTab === 'all' && (
                <div className="border-b border-gray-100">
                  <motion.button
                    onClick={() => toggleSection('status')}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-900">Status</span>
                    <motion.div
                      animate={{ rotate: expandedSections.status ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence initial={false}>
                    {expandedSections.status && (
                      <motion.div
                        variants={sectionVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="px-4 pb-3 space-y-1">
                          {statusOptions.map((option, i) => (
                            <motion.label
                              key={option.value}
                              custom={i}
                              variants={checkboxVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md hover:bg-white transition-colors group"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.status.includes(option.value)}
                                  onChange={() => handleCheckboxChange('status', option.value)}
                                  className="w-4 h-4 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer accent-purple-600 transition-all"
                                />
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                {option.label}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Priority - Only show if priorities exist */}
              {priorityOptions.length > 0 && (
                <div className="border-b premium-scrollbar border-gray-100">
                  <motion.button
                    onClick={() => toggleSection('priority')}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center premium-scrollbar justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-900">Priority</span>
                    <motion.div
                      animate={{ rotate: expandedSections.priority ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence initial={false}>
                    {expandedSections.priority && (
                      <motion.div
                        variants={sectionVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="px-4 pb-3 space-y-1">
                          {priorityOptions.map((option, i) => (
                            <motion.label
                              key={option.value}
                              custom={i}
                              variants={checkboxVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md hover:bg-white transition-colors group"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.priority.includes(option.value)}
                                  onChange={() => handleCheckboxChange('priority', option.value)}
                                  className="w-4 h-4 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer accent-purple-600 transition-all"
                                />
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                                {option.label}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Category - Only show if categories exist */}
              {categoryOptions.length > 0 && (
                <div className="border-b premium-scrollbar border-gray-100">
                  <motion.button
                    onClick={() => toggleSection('category')}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center premium-scrollbar justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-900">Category</span>
                    <motion.div
                      animate={{ rotate: expandedSections.category ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </motion.button>
                  
                  <AnimatePresence initial={false}>
                    {expandedSections.category && (
                      <motion.div
                        variants={sectionVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="overflow-hidden premium-scrollbar bg-gray-50"
                      >
                        <div className="px-4 pb-3 premium-scrollbar space-y-1">
                          {categoryOptions.map((option, i) => (
                            <motion.label
                              key={option.value}
                              custom={i}
                              variants={checkboxVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded-md hover:bg-white transition-colors group"
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.category.includes(option.label)}
                                  onChange={() => handleCheckboxChange('category', option.label)}
                                  className="w-4 h-4 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer accent-purple-600 transition-all"
                                />
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                                {option.label}
                              </span>
                            </motion.label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer with Apply and Clear buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="p-3 flex gap-2 border-t border-gray-200 bg-white"
            >
              <motion.button
                onClick={handleClearFilter}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filter
              </motion.button>
              <motion.button
                onClick={handleApplyFilter}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Apply
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;