import * as React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '../../lib/utils';

export interface FileInfo {
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** File type/mime */
  type?: string;
  /** File URI (for RN) */
  uri?: string;
}

export interface FileInputProps {
  /** Callback when files should be selected (opens picker) */
  onSelectFiles: () => void;
  /** Current files */
  files?: FileInfo[];
  /** Callback to remove a file */
  onRemove?: (index: number) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Show drop zone style */
  showDropZone?: boolean;
  /** Show file list */
  showFileList?: boolean;
  /** Maximum file size in bytes (for display) */
  maxSize?: number;
  /** Button text */
  buttonText?: string;
  /** Drop zone text */
  dropZoneText?: string;
  /** Error message */
  error?: string;
  /** Additional className */
  className?: string;
}

/**
 * FileInput Component
 *
 * File input button/zone that triggers file selection callback.
 * The actual file picking should be handled by the parent using
 * expo-document-picker or similar library.
 *
 * @example
 * ```tsx
 * <FileInput
 *   onSelectFiles={pickDocuments}
 *   files={selectedFiles}
 *   onRemove={removeFile}
 *   showDropZone
 * />
 * ```
 */
export const FileInput: React.FC<FileInputProps> = ({
  onSelectFiles,
  files = [],
  onRemove,
  disabled = false,
  showDropZone = false,
  showFileList = true,
  maxSize,
  buttonText = 'Choose Files',
  dropZoneText = 'Tap to select files',
  error,
  className,
}) => {
  // Format file size to human-readable string
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Drop zone UI
  if (showDropZone) {
    return (
      <View className={cn('w-full', className)}>
        <Pressable
          onPress={onSelectFiles}
          disabled={disabled}
          className={cn(
            'border-2 border-dashed rounded-lg p-8',
            'border-border',
            'active:border-primary active:bg-primary/10 ',
            disabled && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel={buttonText}
          accessibilityState={{ disabled }}
        >
          <View className='items-center justify-center gap-3'>
            <Text className='text-4xl text-muted-foreground'>📁</Text>
            <Text className='text-sm text-muted-foreground text-center'>
              {dropZoneText}
            </Text>
            {maxSize && (
              <Text className='text-xs text-muted-foreground'>
                Max file size: {formatFileSize(maxSize)}
              </Text>
            )}
          </View>
        </Pressable>

        {error && (
          <Text className='mt-2 text-sm text-destructive'>{error}</Text>
        )}

        {showFileList && files.length > 0 && (
          <FileList
            files={files}
            onRemove={onRemove}
            formatFileSize={formatFileSize}
          />
        )}
      </View>
    );
  }

  // Button UI
  return (
    <View className={cn('w-full', className)}>
      <Pressable
        onPress={onSelectFiles}
        disabled={disabled}
        className={cn(
          'flex-row items-center px-4 py-2',
          'border border-border',
          'rounded-lg',
          'bg-card',
          'active:bg-muted ',
          disabled && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={buttonText}
        accessibilityState={{ disabled }}
      >
        <Text className='text-lg mr-2'>📄</Text>
        <Text className='text-sm font-medium text-muted-foreground'>
          {buttonText}
        </Text>
      </Pressable>

      {error && <Text className='mt-2 text-sm text-destructive'>{error}</Text>}

      {showFileList && files.length > 0 && (
        <FileList
          files={files}
          onRemove={onRemove}
          formatFileSize={formatFileSize}
        />
      )}
    </View>
  );
};

/**
 * FileList Component - Internal
 */
const FileList: React.FC<{
  files: FileInfo[];
  onRemove?: (index: number) => void;
  formatFileSize: (bytes: number) => string;
}> = ({ files, onRemove, formatFileSize }) => {
  return (
    <ScrollView className='mt-3 max-h-48'>
      {files.map((file, index) => (
        <View
          key={`${file.name}-${index}`}
          className='flex-row items-center justify-between p-2 mb-2 bg-card rounded-lg border border-border'
        >
          <View className='flex-row items-center flex-1 mr-2'>
            <Text className='text-lg mr-2'>📄</Text>
            <View className='flex-1'>
              <Text
                className='text-sm font-medium text-foreground'
                numberOfLines={1}
              >
                {file.name}
              </Text>
              <Text className='text-xs text-muted-foreground'>
                {formatFileSize(file.size)}
              </Text>
            </View>
          </View>

          {onRemove && (
            <Pressable
              onPress={() => onRemove(index)}
              className='p-1 active:bg-destructive/10  rounded'
              accessibilityRole='button'
              accessibilityLabel='Remove file'
            >
              <Text className='text-destructive '>✕</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
};
