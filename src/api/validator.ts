import { ValidatorProfile, ValidationTask, ValidationMetrics, ValidationRequest } from '../types/validator';
import { AssetDocument } from '../types';
import { apiClient } from './client';

export const validatorApi = {
  // Profile Management
  getProfile: async (validatorId: string): Promise<ValidatorProfile> => {
    const response = await apiClient.get(`/validators/${validatorId}/profile`);
    return response.data as ValidatorProfile;
  },

  updateProfile: async (profile: Partial<ValidatorProfile>): Promise<ValidatorProfile> => {
    const response = await apiClient.put(`/validators/${profile.id}/profile`, profile);
    return response.data as ValidatorProfile;
  },

  // Validation Tasks
  getTasks: async (validatorId: string, status?: string): Promise<ValidationTask[]> => {
    const response = await apiClient.get(`/validators/${validatorId}/tasks`, {
      params: { status }
    });
    return response.data as ValidationTask[];
  },

  getTaskDetails: async (taskId: string): Promise<ValidationTask> => {
    const response = await apiClient.get(`/validation/tasks/${taskId}`);
    return response.data as ValidationTask;
  },

  acceptTask: async (taskId: string): Promise<ValidationTask> => {
    const response = await apiClient.post(`/validation/tasks/${taskId}/accept`);
    return response.data as ValidationTask;
  },

  rejectTask: async (taskId: string, reason: string): Promise<ValidationTask> => {
    const response = await apiClient.post(`/validation/tasks/${taskId}/reject`, { reason });
    return response.data as ValidationTask;
  },

  submitValidation: async (taskId: string, validation: {
    status: 'approved' | 'rejected';
    comments: string;
    checklist: {
      item: string;
      status: 'passed' | 'failed';
      comments?: string;
    }[];
    valuation?: {
      value: number;
      currency: string;
      basis: string;
    };
  }): Promise<ValidationTask> => {
    const response = await apiClient.post(`/validation/tasks/${taskId}/submit`, validation);
    return response.data as ValidationTask;
  },

  // Validation Requests
  getRequests: async (filters?: {
    expertise?: string[];
    jurisdiction?: string[];
    status?: string;
  }): Promise<ValidationRequest[]> => {
    const response = await apiClient.get('/validation/requests', { params: filters });
    return response.data as ValidationRequest[];
  },

  getRequestDetails: async (requestId: string): Promise<ValidationRequest> => {
    const response = await apiClient.get(`/validation/requests/${requestId}`);
    return response.data as ValidationRequest;
  },

  // Performance Metrics
  getMetrics: async (validatorId: string): Promise<ValidationMetrics> => {
    const response = await apiClient.get(`/validators/${validatorId}/metrics`);
    return response.data as ValidationMetrics;
  },

  // Document Management
  uploadDocument: async (taskId: string, document: AssetDocument): Promise<void> => {
    const formData = new FormData();
    formData.append('document', document.file);
    formData.append('type', document.type);
    formData.append('description', document.description || '');
    
    await apiClient.post(`/validation/tasks/${taskId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getDocuments: async (taskId: string): Promise<AssetDocument[]> => {
    const response = await apiClient.get(`/validation/tasks/${taskId}/documents`);
    return response.data as AssetDocument[];
  },

  // Availability Management
  updateAvailability: async (validatorId: string, available: boolean): Promise<void> => {
    await apiClient.put(`/validators/${validatorId}/availability`, { available });
  },

  // Fee Management
  updateFees: async (validatorId: string, fees: {
    base: number;
    currency: string;
    rushFee?: number;
  }): Promise<void> => {
    await apiClient.put(`/validators/${validatorId}/fees`, fees);
  },
};