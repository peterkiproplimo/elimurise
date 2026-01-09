import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import smsApi from "../../services/smsApi";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

export default function Wallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const schoolId = (window as any).CURRENT_SCHOOL_ID || "DEFAULT_SCHOOL";

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const resp = await smsApi.getWallet(schoolId);
      setWallet(resp.data);
      // Clear any previous errors
      if (notification?.type === "error") {
        setNotification(null);
      }
    } catch (err: any) {
      console.error("Failed to load wallet:", err);
      setNotification({
        type: "error",
        message: err?.response?.data?.message || "Failed to load wallet information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (topUpAmount <= 0) {
      setNotification({
        type: "error",
        message: "Please enter a valid amount",
      });
      return;
    }

    setProcessing(true);
    try {
      const resp = await smsApi.topUpWallet({
        schoolId,
        amount: topUpAmount,
        reference: `TOPUP-${Date.now()}`,
      });
      setWallet(resp.data);
      setTopUpAmount(0);
      setNotification({
        type: "success",
        message: `Successfully added ${topUpAmount} units to wallet`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error("Top-up error:", err);
      setNotification({
        type: "error",
        message: err?.response?.data?.message || "Failed to top-up wallet",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Lucide icon="Loader" className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const balanceStatus =
    wallet?.balance < 10 ? "warning" : wallet?.balance < 5 ? "danger" : "success";

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">SMS Wallet Management</h2>
      </div>

      {notification && (
        <div
          className={`mt-5 p-4 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex gap-3">
            <Lucide
              icon={
                notification.type === "success"
                  ? "CheckCircle"
                  : "AlertCircle"
              }
              className="w-5 h-5 flex-shrink-0 mt-0.5"
            />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mt-5 lg:grid-cols-3">
        {/* Balance Card */}
        <div className="box">
          <div className="box-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Current Balance
              </h3>
              <Lucide
                icon="Zap"
                className="w-5 h-5 text-yellow-600"
              />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {wallet?.balance || 0}
            </div>
            <div className="text-xs text-gray-600">SMS Tokens Available</div>
            {wallet?.balance === 0 && (
              <div className="mt-3 text-xs bg-red-50 text-red-700 p-2 rounded border border-red-200">
                ⚠️ No tokens available. Please purchase SMS tokens to send messages.
              </div>
            )}
            {wallet?.balance < 10 && (
              <div className="mt-3 text-xs bg-yellow-50 text-yellow-700 p-2 rounded border border-yellow-200">
                ⚠️ Low balance. Consider topping up.
              </div>
            )}
          </div>
        </div>

        {/* Wallet Info */}
        <div className="box">
          <div className="box-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Wallet Info</h3>
              <Lucide icon="Info" className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium text-gray-900">
                  {wallet?.currency || "KES"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${
                    wallet?.balance > 100
                      ? "text-green-600"
                      : wallet?.balance > 10
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {wallet?.balance > 100
                    ? "Good"
                    : wallet?.balance > 10
                    ? "Fair"
                    : "Low"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {wallet?.updatedAt
                    ? new Date(wallet.updatedAt).toLocaleString()
                    : wallet?.createdAt
                    ? new Date(wallet.createdAt).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="box">
          <div className="box-body flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
              <p className="text-xs text-gray-600 mt-1">
                Manage your SMS wallet
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/home/sms/buy")}
                className="w-full"
                variant="primary"
              >
                <Lucide icon="ShoppingCart" className="w-4 h-4 mr-2" />
                Buy SMS Tokens
              </Button>
              <Button
                onClick={loadWallet}
                className="w-full"
                variant="outline-primary"
              >
                <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                Refresh Balance
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          <div className="box-body">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Wallet Information
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your SMS tokens are stored in your wallet. Purchase more tokens to continue sending SMS messages.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Current Balance:</strong> {wallet?.balance || 0} SMS tokens
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Tokens are deducted automatically when you send SMS messages. Each SMS costs 1 token.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
