// This file defines the TypeScript interfaces for team data used across the app.
export interface TeamWorkspace {
  id: string;
  workspaceName: string;
}

export interface TeamUserRef {
  id: string;
  fullName: string;
}

export interface TeamMember {
  id: string;
  user: TeamUserRef;
  joinedAt: string;
}

export interface Team {
  id: string;
  teamName: string;
  description?: string;
  isActive: boolean;
  workspace: TeamWorkspace;
  teamLeader?: TeamUserRef | null;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamRequest {
  teamName: string;
  description?: string;
  workspaceId: string;
  teamLeaderId?: string;
}

export interface UpdateTeamRequest {
  teamName?: string;
  description?: string;
  teamLeaderId?: string;
  isActive?: boolean;
}