import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { delegateSession } = useAuth();

  if (!delegateSession) {
    return {
      isDelegate: false,
      canCreateResults: true,
      canEditExisting: true,
      canDelete: true,
      canFinalize: true,
      canManageRegistrations: true,
    };
  }

  const restrictions = delegateSession.restrictions || [];

  return {
    isDelegate: true,
    canCreateResults: true,
    canEditExisting: !restrictions.includes('no_edit_existing'),
    canDelete: !restrictions.includes('no_delete'),
    canFinalize: !restrictions.includes('no_finalize'),
    canManageRegistrations: !restrictions.includes('no_manage_registrations'),
  };
};

export const checkPermission = (action, delegateSession) => {
  if (!delegateSession) return true;

  const restrictions = delegateSession.restrictions || [];

  const permissionMap = {
    'create:results': true,
    'edit:existing': !restrictions.includes('no_edit_existing'),
    'delete:match': !restrictions.includes('no_delete'),
    'delete:tournament': !restrictions.includes('no_delete'),
    'finalize:tournament': !restrictions.includes('no_finalize'),
    'manage:registrations': !restrictions.includes('no_manage_registrations'),
  };

  return permissionMap[action] ?? true;
};