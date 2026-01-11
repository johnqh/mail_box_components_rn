import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Entity role types
 */
export type EntityRole = 'owner' | 'admin' | 'member' | 'viewer' | 'guest';

/**
 * Entity type
 */
export interface Entity {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  role?: EntityRole;
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Member type
 */
export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: EntityRole;
  joinedAt?: string;
  status?: 'active' | 'inactive' | 'pending';
}

/**
 * Invitation type
 */
export interface Invitation {
  id: string;
  email: string;
  role: EntityRole;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy?: string;
  invitedAt: string;
  expiresAt?: string;
}

/**
 * EntityCard props
 */
export interface EntityCardProps {
  entity: Entity;
  onPress?: (entity: Entity) => void;
  onLongPress?: (entity: Entity) => void;
  selected?: boolean;
  showRole?: boolean;
  showMemberCount?: boolean;
  showDescription?: boolean;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * EntityList props
 */
export interface EntityListProps {
  entities: Entity[];
  onEntityPress?: (entity: Entity) => void;
  onEntityLongPress?: (entity: Entity) => void;
  selectedEntityId?: string;
  showRoles?: boolean;
  showMemberCounts?: boolean;
  showDescriptions?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * EntitySelector props
 */
export interface EntitySelectorProps {
  entities: Entity[];
  selectedEntity?: Entity | null;
  onSelect: (entity: Entity) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  showAvatars?: boolean;
  showRoles?: boolean;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * MemberList props
 */
export interface MemberListProps {
  members: Member[];
  onMemberPress?: (member: Member) => void;
  onRoleChange?: (member: Member, newRole: EntityRole) => void;
  onRemoveMember?: (member: Member) => void;
  currentUserRole?: EntityRole;
  canEditRoles?: boolean;
  canRemoveMembers?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * MemberRoleSelector props
 */
export interface MemberRoleSelectorProps {
  selectedRole: EntityRole;
  onRoleChange: (role: EntityRole) => void;
  availableRoles?: EntityRole[];
  disabled?: boolean;
  showDescriptions?: boolean;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * InvitationForm props
 */
export interface InvitationFormProps {
  onSubmit: (email: string, role: EntityRole) => void | Promise<void>;
  availableRoles?: EntityRole[];
  defaultRole?: EntityRole;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  submitLabel?: string;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * InvitationList props
 */
export interface InvitationListProps {
  invitations: Invitation[];
  onResend?: (invitation: Invitation) => void;
  onCancel?: (invitation: Invitation) => void;
  canResend?: boolean;
  canCancel?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
  className?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Role configuration
 */
export interface RoleConfig {
  role: EntityRole;
  label: string;
  description: string;
  color: string;
}

/**
 * Default role configurations
 */
export const DEFAULT_ROLE_CONFIGS: RoleConfig[] = [
  {
    role: 'owner',
    label: 'Owner',
    description: 'Full access and ownership rights',
    color: 'purple',
  },
  {
    role: 'admin',
    label: 'Admin',
    description: 'Can manage members and settings',
    color: 'blue',
  },
  {
    role: 'member',
    label: 'Member',
    description: 'Can view and contribute',
    color: 'green',
  },
  {
    role: 'viewer',
    label: 'Viewer',
    description: 'Can only view content',
    color: 'gray',
  },
  {
    role: 'guest',
    label: 'Guest',
    description: 'Limited access',
    color: 'yellow',
  },
];
