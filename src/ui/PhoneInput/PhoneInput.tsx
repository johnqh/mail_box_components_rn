import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface Country {
  /** Country code (ISO 3166-1 alpha-2) */
  code: string;
  /** Country name */
  name: string;
  /** Dial code */
  dialCode: string;
  /** Flag emoji */
  flag: string;
}

export interface PhoneInputProps {
  /** Phone value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Selected country code */
  country?: string;
  /** Country change handler */
  onCountryChange?: (country: string) => void;
  /** Available countries (defaults to common countries) */
  countries?: Country[];
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

// Common countries
const DEFAULT_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
];

/**
 * PhoneInput Component
 *
 * Phone number input with country code selector.
 * Formats phone numbers and shows country flags.
 *
 * @example
 * ```tsx
 * <PhoneInput
 *   value={phoneNumber}
 *   onChange={setPhoneNumber}
 *   country={selectedCountry}
 *   onCountryChange={setSelectedCountry}
 * />
 * ```
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  country: controlledCountry,
  onCountryChange,
  countries = DEFAULT_COUNTRIES,
  placeholder = 'Phone number',
  disabled = false,
  className,
}) => {
  const [internalCountry, setInternalCountry] = useState(
    countries[0]?.code || 'US'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCountryCode =
    controlledCountry !== undefined ? controlledCountry : internalCountry;

  const selectedCountry = countries.find(c => c.code === selectedCountryCode);

  // Handle country selection
  const handleCountrySelect = useCallback(
    (countryCode: string) => {
      if (controlledCountry !== undefined && onCountryChange) {
        onCountryChange(countryCode);
      } else {
        setInternalCountry(countryCode);
      }
      setIsOpen(false);
      setSearchQuery('');
    },
    [controlledCountry, onCountryChange]
  );

  // Format phone number (basic formatting)
  const formatPhoneNumber = (input: string): string => {
    // Remove all non-numeric characters
    const cleaned = input.replace(/\D/g, '');

    // Basic US/CA formatting
    if (selectedCountry?.dialCode === '+1') {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6)
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }

    return cleaned;
  };

  // Handle input change
  const handleInputChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    onChange(formatted);
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(
    country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className={cn('w-full', className)}>
      <View className='flex-row gap-2'>
        {/* Country selector */}
        <Pressable
          onPress={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={cn(
            'flex-row items-center gap-2 px-3 py-2 min-w-[120px]',
            'bg-white dark:bg-gray-900',
            'border border-gray-300 dark:border-gray-700',
            'rounded-md',
            disabled && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel='Select country'
        >
          <Text className='text-xl'>{selectedCountry?.flag}</Text>
          <Text className='text-sm font-medium text-gray-900 dark:text-white'>
            {selectedCountry?.dialCode}
          </Text>
          <Text className='text-gray-600 dark:text-gray-400'>▼</Text>
        </Pressable>

        {/* Phone number input */}
        <TextInput
          value={value}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor='#9ca3af'
          keyboardType='phone-pad'
          editable={!disabled}
          className={cn(
            'flex-1 px-3 py-2 text-sm',
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
            'border border-gray-300 dark:border-gray-700',
            'rounded-md',
            disabled && 'opacity-50'
          )}
        />
      </View>

      {/* Full number display */}
      {value && selectedCountry && (
        <Text className='mt-1.5 text-xs text-gray-600 dark:text-gray-400'>
          Full number: {selectedCountry.dialCode} {value}
        </Text>
      )}

      {/* Country picker modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='slide'
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className='flex-1 justify-end bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-white dark:bg-gray-900 rounded-t-xl max-h-[70%]'>
                {/* Search */}
                <View className='p-3 border-b border-gray-200 dark:border-gray-700'>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder='Search countries...'
                    placeholderTextColor='#9ca3af'
                    className='px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md'
                  />
                </View>

                {/* Countries list */}
                <ScrollView className='max-h-80'>
                  {filteredCountries.length === 0 ? (
                    <View className='px-3 py-4 items-center'>
                      <Text className='text-sm text-gray-500 dark:text-gray-400'>
                        No countries found
                      </Text>
                    </View>
                  ) : (
                    filteredCountries.map(country => (
                      <Pressable
                        key={country.code}
                        onPress={() => handleCountrySelect(country.code)}
                        className={cn(
                          'flex-row items-center gap-3 px-4 py-3',
                          'active:bg-gray-100 dark:active:bg-gray-800',
                          country.code === selectedCountryCode &&
                            'bg-blue-50 dark:bg-blue-900/30'
                        )}
                        accessibilityRole='button'
                      >
                        <Text className='text-xl'>{country.flag}</Text>
                        <Text className='flex-1 text-sm text-gray-900 dark:text-white'>
                          {country.name}
                        </Text>
                        <Text className='text-sm text-gray-600 dark:text-gray-400'>
                          {country.dialCode}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>

                {/* Done button */}
                <View className='p-3 border-t border-gray-200 dark:border-gray-700'>
                  <Pressable
                    onPress={() => setIsOpen(false)}
                    className='items-center py-3'
                    accessibilityRole='button'
                  >
                    <Text className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                      Done
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
