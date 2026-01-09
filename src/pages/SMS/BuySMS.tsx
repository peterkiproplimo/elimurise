import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import smsApi from "../../services/smsApi";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  tokens: yup
    .number()
    .required("Number of tokens is required")
    .min(1, "Must purchase at least 1 token")
    .integer("Must be a whole number"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
});

interface BuySMSForm {
  tokens: number;
  phone: string;
}

const SMS_UNIT_PRICE = 1.2; // 1.2 KSH per token

export default function BuySMS() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BuySMSForm>({
    resolver: yupResolver(schema),
  });

  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  const tokens = watch("tokens") || 0;
  const totalAmount = tokens * SMS_UNIT_PRICE;

  const schoolId = (window as any).CURRENT_SCHOOL_ID || "DEFAULT_SCHOOL";

  // Poll for purchase status
  useEffect(() => {
    if (!polling || !purchaseId) return;

    const interval = setInterval(async () => {
      try {
        const resp = await smsApi.getPurchaseStatus(purchaseId);
        const purchase = resp.data.data;

        if (purchase.status === "completed") {
          setPolling(false);
          setNotification({
            type: "success",
            message: `Payment successful! ${purchase.tokens} SMS tokens have been added to your wallet.`,
          });
          setTimeout(() => {
            navigate("/home/sms/wallet");
          }, 3000);
        } else if (purchase.status === "failed") {
          setPolling(false);
          setNotification({
            type: "error",
            message: "Payment failed. Please try again.",
          });
        }
      } catch (err) {
        console.error("Error checking purchase status:", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [polling, purchaseId, navigate]);

  const onSubmit = async (data: BuySMSForm) => {
    setProcessing(true);
    setNotification(null);
    setCheckoutRequestID(null);
    setPurchaseId(null);

    try {
      const resp = await smsApi.purchaseSMS({
        schoolId,
        phone: data.phone,
        tokens: data.tokens,
      });

      setCheckoutRequestID(resp.data.checkoutRequestID);
      setPurchaseId(resp.data.data.purchaseId);
      setPolling(true);

      setNotification({
        type: "success",
        message: `STK push sent to ${data.phone}. Please complete the payment on your phone.`,
      });
    } catch (err: any) {
      console.error("Purchase error:", err);
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message || err.message || "Failed to initiate purchase",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Buy SMS Tokens</h2>
        <Button
          onClick={() => navigate("/home/sms/wallet")}
          variant="outline-secondary"
          className="w-24"
        >
          <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" />
          Back
        </Button>
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
              icon={notification.type === "success" ? "CheckCircle" : "AlertCircle"}
              className="w-5 h-5 flex-shrink-0 mt-0.5"
            />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          <div className="box-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6">
                {/* Tokens Input */}
                <div>
                  <FormLabel htmlFor="tokens">
                    Number of SMS Tokens *
                  </FormLabel>
                  <FormInput
                    id="tokens"
                    type="number"
                    placeholder="e.g., 2000"
                    min="1"
                    step="1"
                    {...register("tokens", { valueAsNumber: true })}
                    className={errors.tokens ? "border-danger" : ""}
                  />
                  {errors.tokens && (
                    <div className="mt-1 text-danger text-sm">
                      {String(errors.tokens.message)}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Each token costs {SMS_UNIT_PRICE} KSH. Minimum purchase: 1 token
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <FormLabel htmlFor="phone">
                    MPESA Phone Number *
                  </FormLabel>
                  <FormInput
                    id="phone"
                    type="tel"
                    placeholder="e.g., 254712345678 or 0712345678"
                    {...register("phone")}
                    className={errors.phone ? "border-danger" : ""}
                  />
                  {errors.phone && (
                    <div className="mt-1 text-danger text-sm">
                      {String(errors.phone.message)}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the phone number registered with MPESA
                  </p>
                </div>

                {/* Price Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Purchase Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tokens:</span>
                      <span className="font-medium">{tokens || 0} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per token:</span>
                      <span className="font-medium">{SMS_UNIT_PRICE} KSH</span>
                    </div>
                    <div className="border-t border-blue-300 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-lg text-blue-700">
                          {totalAmount.toFixed(2)} KSH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Lucide icon="Info" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <p className="font-semibold mb-1">Payment Instructions:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Click "Pay with MPESA" to initiate payment</li>
                        <li>You will receive an STK push on your phone</li>
                        <li>Enter your MPESA PIN to complete payment</li>
                        <li>Tokens will be added to your wallet automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={processing || polling}
                    className="w-40"
                    variant="primary"
                  >
                    {processing || polling ? (
                      <>
                        <Lucide
                          icon="Loader"
                          className="w-4 h-4 animate-spin inline-block mr-2"
                        />
                        {polling ? "Processing..." : "Initiating..."}
                      </>
                    ) : (
                      <>
                        <Lucide icon="CreditCard" className="w-4 h-4 inline-block mr-2" />
                        Pay with MPESA
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate("/home/sms/wallet")}
                    variant="outline-secondary"
                    className="w-24"
                  >
                    Cancel
                  </Button>
                </div>

                {polling && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Lucide icon="Loader" className="w-5 h-5 animate-spin text-blue-600" />
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold">Waiting for payment confirmation...</p>
                        <p className="text-xs mt-1">Please complete the payment on your phone.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

