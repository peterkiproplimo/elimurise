import axios from 'axios';

const api = axios.create({ baseURL: '/api/sms' });

const ONFON_URL = 'https://api.onfonmedia.co.ke/v1/sms/SendBulkSMS';
const ACCESS_KEY = 'xxxxxxxx-xxxx-xxxx-xxxx';
const API_KEY = 'Kb1EhwPAozixY7aRn6p4tMkOXmUyWurS9G23eqs5F8B0IHgZ';
const CLIENT_ID = 'ElimuRise';

export function sendSMSDirect(payload: {
  senderId?: string;
  body: string;
  recipients: string[];
  isUnicode?: boolean;
  isFlash?: boolean;
  scheduleDateTime?: string;
}) {
  const providerPayload = {
    SenderId: payload.senderId || 'ELIMURISE',
    IsUnicode: Boolean(payload.isUnicode),
    IsFlash: Boolean(payload.isFlash),
    ScheduleDateTime: payload.scheduleDateTime || undefined,
    MessageParameters: payload.recipients.map((to) => ({
      Number: to,
      Text: payload.body,
    })),
    ApiKey: API_KEY,
    ClientId: CLIENT_ID,
  };

  return axios.post(ONFON_URL, providerPayload, {
    headers: {
      'Content-Type': 'application/json',
      AccessKey: ACCESS_KEY,
    },
    timeout: 15000,
  });
}

export function getWallet(schoolId: string) {
  return api.get(`/wallet/${schoolId}`);
}

export function topUpWallet(payload: { schoolId: string; amount: number; reference?: string }) {
  return api.post('/wallet/topup', payload);
}

export function getMessages(schoolId?: string) {
  const params = schoolId ? { params: { schoolId } } : {};
  return api.get('/messages', params);
}

export function registerWebhook(data: any) {
  return api.post('/webhook', data);
}

export default { sendSMS, getWallet, topUpWallet, getMessages, registerWebhook };
