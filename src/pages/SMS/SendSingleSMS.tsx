import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import smsApi from "../../services/smsApi";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

const schema = yup.object({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits"),
  message: yup
    .string()
    .required("Message is required")
    .min(1, "Message cannot be empty"),
  senderId: yup.string().optional(),
  isUnicode: yup.boolean().optional(),
  isFlash: yup.boolean().optional(),
  scheduleDateTime: yup.string().optional(),
});

interface SendSingleSMSForm {
  phoneNumber: string;
  message: string;
  senderId?: string;
  isUnicode?: boolean;
  isFlash?: boolean;
  scheduleDateTime?: string;
}

export default function SendSingleSMS() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SendSingleSMSForm>({
    resolver: yupResolver(schema),
  });

  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const message = watch("message");

  const onSubmit = async (data: SendSingleSMSForm) => {
    setSending(true);
    setNotification(null);
    
    try {
      // Clean phone number (remove spaces, dashes, parentheses)
      const cleanPhoneNumber = data.phoneNumber.replace(/[\s\-()]/g, "");

      const resp = await smsApi.sendSMSDirect({
        senderId: data.senderId || "ELIMURISE",
        body: data.message,
        recipients: [cleanPhoneNumber],
        isUnicode: data.isUnicode,
        isFlash: data.isFlash,
        scheduleDateTime: data.scheduleDateTime || undefined,
      });

      setNotification({
        type: "success",
        message: `SMS sent successfully! Message ID: ${
          resp.data.providerResp?.requestId || "N/A"
        }`,
      });
      reset();
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      console.error("Send SMS error:", err);
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message || err.message || "Failed to send SMS",
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Send SMS to Single Person</h2>
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
                {/* Phone Number */}
                <div>
                  <FormLabel htmlFor="phoneNumber">
                    Phone Number *
                  </FormLabel>
                  <FormInput
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g., 254712345678"
                    {...register("phoneNumber")}
                    className={errors.phoneNumber ? "border-danger" : ""}
                  />
                  {errors.phoneNumber && (
                    <div className="mt-1 text-danger text-sm">
                      {String(errors.phoneNumber.message)}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the recipient's phone number (with country code)
                  </p>
                </div>

                {/* Sender ID */}
                <div>
                  <FormLabel htmlFor="senderId">Sender ID (Optional)</FormLabel>
                  <FormInput
                    id="senderId"
                    type="text"
                    placeholder="e.g., ELIMURISE"
                    {...register("senderId")}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use default sender ID (ELIMURISE)
                  </p>
                </div>

                {/* SMS Options */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isUnicode"
                      {...register("isUnicode")}
                    />
                    <FormLabel htmlFor="isUnicode" className="mb-0">
                      Send as Unicode
                    </FormLabel>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFlash"
                      {...register("isFlash")}
                    />
                    <FormLabel htmlFor="isFlash" className="mb-0">
                      Send as Flash SMS
                    </FormLabel>
                  </div>
                  <div>
                    <FormLabel htmlFor="scheduleDateTime">Schedule (Optional)</FormLabel>
                    <FormInput
                      id="scheduleDateTime"
                      type="datetime-local"
                      {...register("scheduleDateTime")}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to send immediately
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex justify-between items-center">
                    <FormLabel htmlFor="message">Message *</FormLabel>
                    <span className="text-xs text-gray-500">
                      {message?.length || 0} / 160 characters
                    </span>
                  </div>
                  <FormTextarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={6}
                    {...register("message")}
                    className={errors.message ? "border-danger" : ""}
                  />
                  {errors.message && (
                    <div className="mt-1 text-danger text-sm">
                      {String(errors.message.message)}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-32"
                  variant="primary"
                >
                  {sending ? (
                    <>
                      <Lucide
                        icon="Loader"
                        className="w-4 h-4 animate-spin inline-block mr-2"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Lucide icon="Send" className="w-4 h-4 inline-block mr-2" />
                      Send SMS
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setNotification(null);
                  }}
                  variant="outline-secondary"
                  className="w-24"
                >
                  <Lucide icon="RotateCcw" className="w-4 h-4 inline-block mr-2" />
                  Clear
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

