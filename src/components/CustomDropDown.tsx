import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Search, Loader, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type Definitions ---

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
  selectedItem?: DropdownItem | null;
  onSelect: (item: DropdownItem) => void;
  onSearch: (query: string) => void;
  searchValue: string;
  loading: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  displayField?: string;
  itemRenderer?: (item: DropdownItem) => React.ReactNode;
  showSearch?: boolean;
  showInputAbove?: boolean;
  inputAbovePlaceholder?: string;
  inputAboveValue?: string;
  onInputAboveChange?: (value: string) => void;
  totalItems?: number;
  onShowMore?: () => void;
  loadingMore?: boolean;
  hideTriggerButton?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  selectedItem,
  onSelect,
  onSearch,
  searchValue,
  loading,
  placeholder = 'Select an item...',
  label,
  required = false,
  displayField = 'name',
  itemRenderer,
  showSearch = true,
  showInputAbove = false,
  inputAbovePlaceholder = 'Enter value...',
  inputAboveValue = '',
  onInputAboveChange,
  totalItems,
  onShowMore,
  loadingMore = false,
  hideTriggerButton = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        const selectedIndex = selectedItem ? items.findIndex(item => item.id === selectedItem.id) : -1;
        setHighlightedIndex(selectedIndex !== -1 ? selectedIndex : (items.length > 0 ? 0 : -1));
    } else {
        setHighlightedIndex(-1);
    }
  }, [isOpen, items, selectedItem]);

  useEffect(() => {
    if (hideTriggerButton) {
      setIsOpen(true);
    }
  }, [hideTriggerButton]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!hideTriggerButton) {
           setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideTriggerButton]);

  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
    setHighlightedIndex(0);
  }, [onSearch]);

  const selectAndClose = useCallback((item: DropdownItem) => {
    const isBlocked = item.status?.toLowerCase() === 'block' || item.status?.toLowerCase() === 'blocked';
    if (isBlocked) return;
    
    onSelect(item);
    if (!hideTriggerButton) {
      setIsOpen(false);
      containerRef.current?.querySelector('button:not([role="option"])')?.focus();
    }
  }, [onSelect, hideTriggerButton]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItemsCount = items.length;
    
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (totalItemsCount > 0) {
            setHighlightedIndex(prev => (prev + 1) % totalItemsCount);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (totalItemsCount > 0) {
            setHighlightedIndex(prev => (prev - 1 + totalItemsCount) % totalItemsCount);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex !== -1 && items[highlightedIndex]) {
          selectAndClose(items[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (!hideTriggerButton) {
          setIsOpen(false);
        }
        break;
      case 'Tab':
        if (!hideTriggerButton) setIsOpen(false); 
        break;
    }
  };

  const displayText = useMemo(() => 
    selectedItem ? selectedItem[displayField] : '', 
  [selectedItem, displayField]);

  const DefaultItemRenderer = useCallback(({ item }: { item: DropdownItem }) => {
    const isBlocked = item.status?.toLowerCase() === 'block' || item.status?.toLowerCase() === 'blocked';
    const isInactive = item.status?.toLowerCase() === 'inactive';
    
    return (
      <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${isBlocked ? 'text-gray-500' : 'text-gray-900'}`} title={item.name}>
            {item.name}
          </div>
          {item.email && (
            <div className={`text-xs truncate ${isBlocked ? 'text-gray-400' : 'text-gray-500'}`} title={item.email}>
              {item.email}
            </div>
          )}
        </div>
        {item.status && (
          <div className="flex-shrink-0 ml-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              isBlocked ? 'bg-red-100 text-red-900' : 
              isInactive ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {item.status}
            </span>
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full relative" onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      {showInputAbove && (
        <div className="mb-2">
          <input
            type="text"
            value={inputAboveValue}
            onChange={(e) => onInputAboveChange?.(e.target.value)}
            placeholder={inputAbovePlaceholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm transition-all"
          />
        </div>
      )}

      {!hideTriggerButton && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-gray-400 transition-all duration-200"
        >
          <span className={displayText ? 'text-gray-900 truncate' : 'text-gray-500'}>
            {displayText || placeholder}
          </span>
          <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl z-[100] overflow-hidden"
          >
            {showSearch && (
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-800 text-sm"
                  />
                  {searchValue && (
                    <button onClick={() => { onSearch(''); searchInputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="max-h-80 overflow-y-auto">
              {loading && !loadingMore ? (
                <div className="p-6 flex items-center justify-center">
                  <Loader size={20} className="text-purple-600 animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">No results found.</div>
              ) : (
                <ul className="py-2">
                  {items.map((item, index) => {
                    const isHighlighted = highlightedIndex === index;
                    const isSelected = selectedItem?.id === item.id;
                    const isBlocked = item.status?.toLowerCase() === 'block' || item.status?.toLowerCase() === 'blocked';
                    
                    return (
                      <motion.li 
                        key={item.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <motion.button
                          onClick={() => selectAndClose(item)}
                          onMouseEnter={() => !isBlocked && setHighlightedIndex(index)}
                          disabled={isBlocked}
                          whileTap={!isBlocked ? { scale: 0.98 } : {}}
                          className={`w-full px-4 py-3 text-left transition-all duration-150 flex items-center gap-3 ${
                            isBlocked ? 'opacity-60 cursor-not-allowed' :
                            isHighlighted ? 'bg-gray-100' :
                            isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          {item.avatar && (
                            <img src={item.avatar} alt="" className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${isBlocked ? 'grayscale' : ''}`} />
                          )}
                          {itemRenderer ? itemRenderer(item) : <DefaultItemRenderer item={item} />}
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                              <Check size={18} className="text-purple-600 ml-auto" />
                            </motion.div>
                          )}
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </ul>
              )}

              {totalItems !== undefined && items.length < totalItems && onShowMore && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <button
                    onClick={onShowMore}
                    disabled={loadingMore || loading}
                    className="w-full px-4 py-2 text-center text-sm font-semibold text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Loading More...
                      </>
                    ) : (
                      <span>Show More</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;