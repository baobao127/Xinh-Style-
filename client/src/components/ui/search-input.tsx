import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { useDebounce } from '@/hooks/useLocalStorage';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  
  // Handle voice recognition
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        
        // Focus the input to show the results
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói');
    }
  };

  // Search for products with the debounced search term
  const { data: searchResults, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { search: debouncedSearch }],
    enabled: debouncedSearch.length > 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show dropdown when typing
  useEffect(() => {
    if (debouncedSearch.length > 1) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setDropdownOpen(false);
    }
  };

  const handleProductClick = (slug: string) => {
    setLocation(`/product/${slug}`);
    setDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pl-10 pr-12 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => debouncedSearch.length > 1 && setDropdownOpen(true)}
        />
        <button 
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          aria-label="Tìm kiếm"
        >
          <i className="fas fa-search"></i>
        </button>
        <button 
          type="button"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isListening ? 'text-primary animate-pulse' : 'text-gray-400'}`}
          onClick={startListening}
          aria-label="Tìm kiếm bằng giọng nói"
        >
          <i className="fas fa-microphone"></i>
        </button>
      </form>

      {/* Search results dropdown */}
      {dropdownOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-spinner animate-spin mr-2"></i>
              Đang tìm kiếm...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <ul>
              {searchResults.map((product) => (
                <li 
                  key={product.id} 
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => handleProductClick(product.slug)}
                    className="w-full p-3 flex items-center text-left hover:bg-gray-50"
                  >
                    {product.images && product.images[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-primary text-xs">{product.salePrice || product.price}đ</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : debouncedSearch.length > 1 ? (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy sản phẩm phù hợp
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
