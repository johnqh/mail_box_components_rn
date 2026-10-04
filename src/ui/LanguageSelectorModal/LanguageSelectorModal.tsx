import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
// React Native's own SafeAreaView is deprecated and iOS-only; the context
// package's works on every platform and is what the app already provides.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaEdges } from '../../lib/safe-area-edges';
import { ModalHost } from '../ModalHost';
/*
  Layout is in `styles`; every colour is a semantic class, so it follows the
  palette the host applied (including one set at run time with `vars()`)
  rather than a light-only literal.
*/
import { getSortedLanguages, type LanguageConfig } from './languages';
import { pressProps } from '../../lib/a11y';

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (langCode: string) => void;
  title?: string;
  doneLabel?: string;
  loading?: boolean;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
  currentLanguage,
  onSelectLanguage,
  title = 'Language',
  doneLabel = 'Done',
  loading = false,
}) => {
  const safeEdges = useSafeAreaEdges();
  const sortedLanguages = useMemo(() => getSortedLanguages(), []);

  const renderLanguageItem = ({ item }: { item: LanguageConfig }) => {
    const isSelected = item.code === currentLanguage;

    return (
      <TouchableOpacity
        style={styles.languageItem}
        className={isSelected ? 'bg-primary/10' : undefined}
        {...pressProps(() => onSelectLanguage(item.code))}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text
          style={[styles.languageName, isSelected && styles.selectedText]}
          className={isSelected ? 'text-primary' : 'text-foreground'}
        >
          {item.name}
        </Text>
        {isSelected && (
          <Text style={styles.checkmark} className='text-primary'>
            {'\u2713'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ModalHost visible={visible} animationType='slide' onRequestClose={onClose}>
      <SafeAreaView
        edges={safeEdges}
        style={styles.container}
        className='bg-background'
      >
        <View style={styles.header} className='border-border'>
          <Text style={styles.headerTitle} className='text-foreground'>
            {title}
          </Text>
          <TouchableOpacity {...pressProps(onClose)} style={styles.closeButton}>
            <Text style={styles.closeButtonText} className='text-primary'>
              {doneLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={sortedLanguages}
          keyExtractor={(item: LanguageConfig) => item.code}
          renderItem={renderLanguageItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
        />

        {loading && (
          <View style={styles.loadingOverlay} className='bg-background/90'>
            <ActivityIndicator size='large' className='text-primary' />
          </View>
        )}
      </SafeAreaView>
    </ModalHost>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  flag: {
    fontSize: 24,
    marginEnd: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 17,
  },
  selectedText: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginStart: 60,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ItemSeparator = () => (
  <View style={styles.separator} className='bg-border' />
);

export default LanguageSelectorModal;
