import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5001/api/sms' });

export function sendSMS(payload: {
  schoolId: string;
  senderId?: string;
  body: string;
  recipients: string[];
  isUnicode?: boolean;
  isFlash?: boolean;
  scheduleDateTime?: string;
}) {
  return api.post('/send', payload);
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

export function purchaseSMS(payload: { schoolId: string; phone: string; tokens: number }) {
  return api.post('/purchase', payload);
}

export function getPurchaseStatus(purchaseId: string) {
  return api.get(`/purchase/${purchaseId}`);
}

export function getPurchaseHistory(schoolId: string) {
  return api.get(`/purchases/${schoolId}`);
}

export function getRecipientGroups(schoolId: string, grade?: string) {
  const params = grade ? { params: { grade } } : {};
  return api.get(`/recipient-groups/${schoolId}`, params);
}

export default { sendSMS, getWallet, topUpWallet, getMessages, registerWebhook, purchaseSMS, getPurchaseStatus, getPurchaseHistory, getRecipientGroups };
