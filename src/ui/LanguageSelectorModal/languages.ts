export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
  isRTL?: boolean;
}

export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'] as const;

export const isRTLLanguage = (code: string): boolean => {
  return RTL_LANGUAGES.includes(code as (typeof RTL_LANGUAGES)[number]);
};

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', flag: '\u{1F1FA}\u{1F1F8}' },
  {
    code: 'ar',
    name: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
    flag: '\u{1F1F8}\u{1F1E6}',
    isRTL: true,
  },
  { code: 'de', name: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'es', name: 'Espa\u00F1ol', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'fr', name: 'Fran\u00E7ais', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'it', name: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'ja', name: '\u65E5\u672C\u8A9E', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'ko', name: '\uD55C\uAD6D\uC5B4', flag: '\u{1F1F0}\u{1F1F7}' },
  { code: 'pt', name: 'Portugu\u00EAs', flag: '\u{1F1F5}\u{1F1F9}' },
  {
    code: 'ru',
    name: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439',
    flag: '\u{1F1F7}\u{1F1FA}',
  },
  { code: 'sv', name: 'Svenska', flag: '\u{1F1F8}\u{1F1EA}' },
  { code: 'th', name: '\u0E44\u0E17\u0E22', flag: '\u{1F1F9}\u{1F1ED}' },
  {
    code: 'uk',
    name: '\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430',
    flag: '\u{1F1FA}\u{1F1E6}',
  },
  { code: 'vi', name: 'Ti\u1EBFng Vi\u1EC7t', flag: '\u{1F1FB}\u{1F1F3}' },
  { code: 'zh', name: '\u7B80\u4F53\u4E2D\u6587', flag: '\u{1F1E8}\u{1F1F3}' },
  {
    code: 'zh-hant',
    name: '\u7E41\u9AD4\u4E2D\u6587',
    flag: '\u{1F1F9}\u{1F1FC}',
  },
];

export const getLanguageByCode = (code: string): LanguageConfig | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

export const getSortedLanguages = (): LanguageConfig[] => {
  return [...LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));
};
