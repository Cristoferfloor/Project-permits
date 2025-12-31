import { SetMetadata } from '@nestjs/common';
import { AreaCode, AreaPermission } from '@prisma/client';

export const AREA_PERMISSION_KEY = 'area_permission';

export interface AreaPermissionRequirement {
  area: AreaCode;
  permissions: AreaPermission[];
}

export const RequireAreaPermission = (
  area: AreaCode,
  ...permissions: AreaPermission[]
) => SetMetadata(AREA_PERMISSION_KEY, { area, permissions });