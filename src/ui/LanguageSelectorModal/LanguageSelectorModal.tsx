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
// RN StyleSheet/color props (placeholderTextColor, ActivityIndicator color, SVG
// fill) can't use NativeWind classNames, so they reference the design system's
// raw palette — the lib-wide convention for RN-only color props.
import { colors } from '@sudobility/design';
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
            <ActivityIndicator size='large' color={colors.raw.blue[500]} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.raw.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.raw.neutral[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.raw.neutral[800],
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.raw.blue[500],
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
    backgroundColor: colors.raw.blue[50],
  },
  flag: {
    fontSize: 24,
    marginEnd: 16,
  },
  languageName: {
    flex: 1,
    fontSize: 17,
    color: colors.raw.neutral[800],
  },
  selectedText: {
    fontWeight: '600',
    color: colors.raw.blue[500],
  },
  checkmark: {
    fontSize: 18,
    color: colors.raw.blue[500],
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.raw.neutral[100],
    marginStart: 60,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Translucent scrim that dims content while loading (no semantic token
    // exists for a translucent overlay; kept as a literal like modal scrims).
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export default LanguageSelectorModal;
