import axiosClient from '../Middleware/AxiosClient';

// Create a new support ticket
export const createTicket = async (ticketData) => {
  const formData = new FormData();

  // Add text fields
  formData.append('subject', ticketData.subject);
  formData.append('description', ticketData.description);
  formData.append('category', ticketData.category);
  if (ticketData.priority) formData.append('priority', ticketData.priority);

  if (ticketData.attachments) {
    ticketData.attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const response = await axiosClient.post('/api/tickets/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};

// Get all tickets for current user
export const getUserTickets = async () => {
  const response = await axiosClient.get('/api/tickets/my-tickets', {
    withCredentials: true,
  });
  return response.data;
};

// Get a specific ticket by ID
export const getTicketById = async (ticketId) => {
  const response = await axiosClient.get(`/api/tickets/${ticketId}`, {
    withCredentials: true,
  });
  return response.data;
};

// Add a response to a ticket
export const addTicketResponse = async (ticketId, message) => {
  const response = await axiosClient.post(`/api/tickets/${ticketId}/respond`, {
    message,
  }, {
    withCredentials: true,
  });
  return response.data;
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  const response = await axiosClient.patch(`/api/tickets/${ticketId}/status`, {
    status,
  },{
    withCredentials: true,
  });
  return response.data;
};

// Admin: Get all tickets (with filters)
export const getAllTickets = async (filters = {}) => {
  const { status, priority, category, page = 1, limit = 10 } = filters;

  let queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  if (priority) queryParams.append('priority', priority);
  if (category) queryParams.append('category', category);
  queryParams.append('page', page);
  queryParams.append('limit', limit);

  const response = await axiosClient.get(`/api/tickets?${queryParams.toString()}`, {
    withCredentials: true,
  });
  return response.data;
};
