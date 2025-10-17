import axios from "axios";
import * as c from "../utils/constants";

const getData = async () => {
  try {
    const user = await localStorage.getItem("user");
    if (user !== null) {
      // value previously stored
      let token = JSON.parse(user);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.token}`;
      axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};
getData();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export function handler(err: any) {
  let error = err;

  if (err.response && err.response.data.hasOwnProperty("message"))
    error = err.response.data;
  else if (!err.hasOwnProperty("message")) error = err.toJSON();

  return new Error(error.message);
}

// M-Pesa Payment Functions
export const initiateMpesaPayment = async (paymentData: {
  phone: string;
  amount: number;
  userId?: string;
}) => {
  try {
    const response = await axios.post(`${c.BASE_LOCAL_URL}mpesa/deposit`, {
      phone: paymentData.phone,
      amount: paymentData.amount,
      userId: paymentData.userId
    });
    return response.data;
  } catch (error) {
    throw handler(error);
  }
};

export const checkMpesaTransactionStatus = async (checkoutRequestID: string) => {
  try {
    const response = await axios.post(`${c.BASE_LOCAL_URL}mpesa/transaction-status`, {
      transactionId: checkoutRequestID
    });
    return response.data;
  } catch (error) {
    throw handler(error);
  }
};

// New function to get transaction status by CheckoutRequestID
export const getTransactionStatus = async (checkoutRequestID: string) => {
  try {
    const response = await axios.get(`${c.BASE_LOCAL_URL}mpesa/transaction-status/${checkoutRequestID}`);
    return response.data;
  } catch (error) {
    throw handler(error);
  }
};

export const withdrawMpesa = async (withdrawData: {
  phone: string;
  amount: number;
  userId?: string;
}) => {
  try {
    const response = await axios.post(`${c.BASE_LOCAL_URL}mpesa/withdraw`, {
      phone: withdrawData.phone,
      amount: withdrawData.amount,
      userId: withdrawData.userId
    });
    return response.data;
  } catch (error) {
    throw handler(error);
  }

};