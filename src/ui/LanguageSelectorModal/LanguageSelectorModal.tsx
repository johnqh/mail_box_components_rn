import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getSortedLanguages, type LanguageConfig } from './languages';

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
  const sortedLanguages = useMemo(() => getSortedLanguages(), []);

  const renderLanguageItem = ({ item }: { item: LanguageConfig }) => {
    const isSelected = item.code === currentLanguage;

    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedItem]}
        onPress={() => onSelectLanguage(item.code)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text style={[styles.languageName, isSelected && styles.selectedText]}>
          {item.name}
        </Text>
        {isSelected && <Text style={styles.checkmark}>{'\u2713'}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{doneLabel}</Text>
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
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size='large' color='#3b82f6' />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
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
  selectedItem: {
    backgroundColor: '#f0f9ff',
  },
  flag: {
    fontSize: 24,
    marginEnd: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 17,
    color: '#1f2937',
  },
  selectedText: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  checkmark: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginStart: 60,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export default LanguageSelectorModal;
