const API_BASE_URL = 'https://finikvest-backend-production.up.railway.app/api';

async function request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Ошибка ${response.status}`);
  }
  return response.json();
}

export const register = (username: string, email: string, password: string) =>
  request<{ success: boolean; message: string; userId: number; username: string }>(
    '/auth/register',
    'POST',
    {
      username,
      email,
      password,
    }
  );

export const login = (email: string, password: string) =>
  request<{ success: boolean; userId: number; username: string }>('/auth/login', 'POST', {
    email,
    password,
  });

export const loadProgress = (userId: number) =>
  request<{
    balance: number;
    budget: number;
    covers: { needs: number; wants: number; savings: number; good: number };
    completed_quests: number[];
    current_quest_id: number | null;
    goal: { title: string; targetAmount: number } | null;
  }>(`/progress/${userId}`);

export const saveProgress = (
  userId: number,
  data: {
    balance: number;
    budget: number;
    covers: { needs: number; wants: number; savings: number; good: number };
    completedQuests: number[];
    currentQuestId: number | null;
    goal: { title: string; targetAmount: number } | null;
  }
) => request<{ success: boolean; message: string }>('/progress', 'POST', { userId, ...data });

export const fetchQuests = async () => {
  return request<any[]>('/quests', 'GET');
};

export const addQuest = async (questData: any) => {
  return request<any>('/admin/quests', 'POST', questData);
};

export const updateQuest = async (questId: number, questData: any) => {
  return request<any>(`/admin/quests/${questId}`, 'PUT', questData);
};

export const deleteQuest = async (questId: number) => {
  return request<any>(`/admin/quests/${questId}`, 'DELETE');
};

export const sendVerificationCode = (email: string) =>
  request<{ success: boolean; message: string }>('/auth/send-verification', 'POST', { email });

export const verifyEmail = (email: string, code: string) =>
  request<{ success: boolean; message: string }>('/auth/verify-email', 'POST', { email, code });
