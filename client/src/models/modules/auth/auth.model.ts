import type { Occupation, Organization, Status } from './enums.model';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;

  organization: Organization;
  organization_name?: string;

  occupation: Occupation;
  status: Status;

  createdAt: string;
  updatedAt: string;
}

