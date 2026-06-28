import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';
import type { EntityListProps, Entity } from './types';
import { EntityCard } from './EntityCard';

/**
 * EntityList - List of EntityCards
 */
export const EntityList: React.FC<EntityListProps> = ({
  entities,
  onEntityPress,
  onEntityLongPress,
  selectedEntityId,
  showRoles = true,
  showMemberCounts = true,
  showDescriptions = true,
  emptyMessage = 'No entities found',
  emptyIcon,
  loading = false,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
  className = '',
  style,
  testID,
}) => {
  const renderItem = ({ item }: { item: Entity }) => (
    <EntityCard
      entity={item}
      onPress={onEntityPress}
      onLongPress={onEntityLongPress}
      selected={selectedEntityId === item.id}
      showRole={showRoles}
      showMemberCount={showMemberCounts}
      showDescription={showDescriptions}
      className='mb-3'
    />
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className='flex-1 items-center justify-center py-12'>
          <ActivityIndicator size='large' color={colors.raw.blue[500]} />
          <Text className='text-muted-foreground mt-4'>
            Loading...
          </Text>
        </View>
      );
    }

    return (
      <View className='flex-1 items-center justify-center py-12'>
        {emptyIcon}
        <Text className='text-muted-foreground text-center mt-2'>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  const keyExtractor = (item: Entity) => item.id;

  return (
    <View className={cn('flex-1', className)} style={style} testID={testID}>
      <FlatList
        data={entities}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.raw.blue[500]}
            />
          ) : undefined
        }
      />
    </View>
  );
};

export default EntityList;
