import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import smsApi from "../../services/smsApi";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormTextarea,
  FormSelect,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";

const schema = yup.object({
  recipientGroup: yup.string().optional(),
  recipients: yup.string().optional(),
  message: yup.string()
    .required("Message is required")
    .min(1, "Message cannot be empty"),
  senderId: yup.string().optional(),
  isUnicode: yup.boolean().optional(),
  isFlash: yup.boolean().optional(),
  scheduleDateTime: yup.string().optional(),
}).test("recipients-required", "Recipients are required", function(values) {
  return !!values.recipientGroup || !!values.recipients?.trim();
});

interface SendSMSForm {
  recipientGroup?: string;
  recipients?: string;
  message: string;
  senderId?: string;
  isUnicode?: boolean;
  isFlash?: boolean;
  scheduleDateTime?: string;
}

interface RecipientGroup {
  name: string;
  count: number;
  phones: string[];
}

const RECIPIENT_GROUPS: Record<string, RecipientGroup> = {
  parents: {
    name: "Parents",
    count: 1250,
    phones: Array.from({ length: 1250 }, (_, i) => `25471234${String(i).padStart(4, "0")}`),
  },
  students: {
    name: "Students",
    count: 2840,
    phones: Array.from({ length: 2840 }, (_, i) => `25472234${String(i).padStart(4, "0")}`),
  },
  staff: {
    name: "Staff",
    count: 185,
    phones: Array.from({ length: 185 }, (_, i) => `25473234${String(i).padStart(4, "0")}`),
  },
};

export default function SendSMS() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SendSMSForm>({
    resolver: yupResolver(schema),
  });

  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [recipientCount, setRecipientCount] = useState(0);
  const recipients = watch("recipients");
  const recipientGroup = watch("recipientGroup");
  const message = watch("message");

  React.useEffect(() => {
    const manualCount = recipients
      ?.split(/[,\n;]/)
      .map((r) => r.trim())
      .filter(Boolean).length || 0;

    const groupCount = recipientGroup
      ? RECIPIENT_GROUPS[recipientGroup]?.count || 0
      : 0;

    setRecipientCount(manualCount + groupCount);
  }, [recipients, recipientGroup]);

  const onSubmit = async (data: SendSMSForm) => {
    setSending(true);
    try {
      let recipientList: string[] = [];

      // Add selected group recipients
      if (data.recipientGroup && RECIPIENT_GROUPS[data.recipientGroup]) {
        recipientList = [
          ...recipientList,
          ...RECIPIENT_GROUPS[data.recipientGroup].phones,
        ];
      }

      // Add manually entered recipients
      if (data.recipients?.trim()) {
        const manualRecipients = data.recipients
          .split(/[,\n;]/)
          .map((r) => r.trim())
          .filter(Boolean);
        recipientList = [...recipientList, ...manualRecipients];
      }

      if (recipientList.length === 0) {
        throw new Error("No valid recipients");
      }

      const resp = await smsApi.sendSMSDirect({
        senderId: data.senderId || "ELIMURISE",
        body: data.message,
        recipients: recipientList,
        isUnicode: data.isUnicode,
        isFlash: data.isFlash,
        scheduleDateTime: data.scheduleDateTime || undefined,
      });

      setNotification({
        type: "success",
        message: `SMS queued successfully! Message ID: ${
          resp.data.providerResp?.requestId || "N/A"
        }`,
      });
      reset();
      setRecipientCount(0);

      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error("Send SMS error:", err);
      setNotification({
        type: "error",
        message:
          err?.response?.data?.message || err.message || "Failed to send SMS",
      });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const phones = content
        .split(/[,\n;]/)
        .map((p) => p.trim())
        .filter(Boolean)
        .join("\n");

      const textarea = document.querySelector(
        "textarea[name='recipients']"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = phones;
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Send SMS Messages</h2>
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

                {/* Recipient Group Dropdown */}
                <div>
                  <FormLabel htmlFor="recipientGroup">
                    Select Recipient Group (Optional)
                  </FormLabel>
                  <FormSelect
                    id="recipientGroup"
                    {...register("recipientGroup")}
                  >
                    <option value="">-- Select a group --</option>
                    {Object.entries(RECIPIENT_GROUPS).map(([key, group]) => (
                      <option key={key} value={key}>
                        {group.name} ({group.count} recipients)
                      </option>
                    ))}
                  </FormSelect>
                  <p className="text-xs text-gray-500 mt-1">
                    {recipientGroup
                      ? `Selected: ${RECIPIENT_GROUPS[recipientGroup]?.name}`
                      : "No group selected"}
                  </p>
                </div>

                {/* Recipient Count */}
                <div>
                  <FormLabel>Recipients Count</FormLabel>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {recipientCount}
                    </div>
                    <div className="text-xs text-blue-700">
                      {recipientCount > 0
                        ? recipientCount === 1
                          ? "phone number"
                          : "phone numbers"
                        : "no recipients"}
                    </div>
                  </div>
                </div>

                {/* Selected Group Info */}
                {recipientGroup && (
                  <div className="sm:col-span-2">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex gap-2 text-sm">
                        <Lucide icon="AlertCircle" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-700">
                          <strong>{RECIPIENT_GROUPS[recipientGroup]?.name}</strong> group ({RECIPIENT_GROUPS[recipientGroup]?.count} recipients) will be included.
                          {recipients?.trim() && " Additional manual entries will also be sent."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message - Full Width */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <FormLabel htmlFor="message">Message * (Required)</FormLabel>
                    <span className="text-xs text-gray-500">
                      {message?.length || 0} / 160 characters
                    </span>
                  </div>
                  <FormTextarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={5}
                    {...register("message")}
                  />
                  {errors.message && (
                    <div className="mt-1 text-danger text-sm">
                      {String(errors.message.message)}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Box */}
              {recipientCount > 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-gray-700">
                    <strong>Summary:</strong> You are about to send{" "}
                    <strong className="text-blue-700">
                      {recipientCount} SMS message{recipientCount > 1 ? "s" : ""}
                    </strong>
                    . Each message will be charged as{" "}
                    <strong>1 SMS unit</strong>.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={sending || recipientCount === 0}
                  className="w-24"
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
                      Send
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setRecipientCount(0);
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
