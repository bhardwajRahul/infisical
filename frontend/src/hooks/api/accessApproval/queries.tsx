import { PackRule, unpackRules } from "@casl/ability/extra";
import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";
import { TReactQueryOptions } from "@app/types/reactQuery";

import { TProjectPermission } from "../roles/types";
import {
  TAccessApprovalPolicy,
  TAccessApprovalRequest,
  TAccessRequestCount,
  TGetAccessApprovalRequestsDTO,
  TGetAccessPolicyApprovalCountDTO
} from "./types";

export const accessApprovalKeys = {
  getAccessApprovalPolicies: (projectSlug: string) =>
    [{ projectSlug }, "access-approval-policies"] as const,
  getAccessApprovalPolicyOfABoard: (workspaceId: string, environment: string) =>
    [{ workspaceId, environment }, "access-approval-policy"] as const,

  getAccessApprovalRequests: (
    projectSlug: string,
    envSlug?: string,
    requestedBy?: string,
    bypassReason?: string
  ) => [{ projectSlug, envSlug, requestedBy, bypassReason }, "access-approvals-requests"] as const,
  getAccessApprovalRequestCount: (projectSlug: string, policyId?: string) =>
    [{ projectSlug }, "access-approval-request-count", ...(policyId ? [policyId] : [])] as const
};

export const fetchPolicyApprovalCount = async ({
  projectSlug,
  envSlug
}: TGetAccessPolicyApprovalCountDTO) => {
  const { data } = await apiRequest.get<{ count: number }>(
    "/api/v1/access-approvals/policies/count",
    {
      params: { projectSlug, envSlug }
    }
  );
  return data.count;
};

export const useGetAccessPolicyApprovalCount = ({
  projectSlug,
  envSlug,
  options = {}
}: TGetAccessPolicyApprovalCountDTO & TReactQueryOptions) =>
  useQuery({
    queryKey: accessApprovalKeys.getAccessApprovalRequestCount(projectSlug),
    queryFn: () => fetchPolicyApprovalCount({ projectSlug, envSlug }),
    ...options,
    enabled: Boolean(projectSlug) && (options?.enabled ?? true)
  });

const fetchApprovalPolicies = async ({ projectSlug }: TGetAccessApprovalRequestsDTO) => {
  const { data } = await apiRequest.get<{ approvals: TAccessApprovalPolicy[] }>(
    "/api/v1/access-approvals/policies",
    { params: { projectSlug } }
  );
  return data.approvals;
};

const fetchApprovalRequests = async ({
  projectSlug,
  envSlug,
  authorUserId
}: TGetAccessApprovalRequestsDTO) => {
  const { data } = await apiRequest.get<{ requests: TAccessApprovalRequest[] }>(
    "/api/v1/access-approvals/requests",
    { params: { projectSlug, envSlug, authorUserId } }
  );

  return data.requests.map((request) => ({
    ...request,

    privilege: request.privilege
      ? {
          ...request.privilege,
          permissions: unpackRules(
            request.privilege.permissions as unknown as PackRule<TProjectPermission>[]
          )
        }
      : null,
    permissions: unpackRules(request.permissions as unknown as PackRule<TProjectPermission>[])
  }));
};

const fetchAccessRequestsCount = async (projectSlug: string, policyId?: string) => {
  const { data } = await apiRequest.get<TAccessRequestCount>(
    "/api/v1/access-approvals/requests/count",
    { params: { projectSlug, policyId } }
  );
  return data;
};

export const useGetAccessRequestsCount = ({
  projectSlug,
  policyId,
  options = {}
}: TGetAccessApprovalRequestsDTO & TReactQueryOptions) =>
  useQuery({
    queryKey: accessApprovalKeys.getAccessApprovalRequestCount(projectSlug, policyId),
    queryFn: () => fetchAccessRequestsCount(projectSlug, policyId),
    ...options,
    enabled: Boolean(projectSlug) && (options?.enabled ?? true)
  });

export const useGetAccessApprovalPolicies = ({
  projectSlug,
  envSlug,
  authorUserId,
  options = {}
}: TGetAccessApprovalRequestsDTO & TReactQueryOptions) =>
  useQuery({
    queryKey: accessApprovalKeys.getAccessApprovalPolicies(projectSlug),
    queryFn: () => fetchApprovalPolicies({ projectSlug, envSlug, authorUserId }),
    ...options,
    enabled: Boolean(projectSlug) && (options?.enabled ?? true)
  });

export const useGetAccessApprovalRequests = ({
  projectSlug,
  envSlug,
  authorUserId,
  options = {}
}: TGetAccessApprovalRequestsDTO & TReactQueryOptions) =>
  useQuery({
    queryKey: accessApprovalKeys.getAccessApprovalRequests(projectSlug, envSlug, authorUserId),
    queryFn: () => fetchApprovalRequests({ projectSlug, envSlug, authorUserId }),
    ...options,
    enabled: Boolean(projectSlug) && (options?.enabled ?? true),
    placeholderData: (previousData) => previousData
  });
