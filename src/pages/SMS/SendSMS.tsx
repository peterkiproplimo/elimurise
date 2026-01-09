import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import smsApi from "../../services/smsApi";
import * as ApiService from "../../services/auth";
import Button from "../../base-components/Button";
import {
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
}).test("recipients-required", "Recipients are required", function(values) {
  return !!values.recipientGroup || !!values.recipients?.trim();
});

interface SendSMSForm {
  recipientGroup?: string;
  recipients?: string;
  message: string;
}

interface RecipientGroup {
  name: string;
  count: number;
  phones: string[];
}

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
  const [recipientGroups, setRecipientGroups] = useState<Record<string, RecipientGroup>>({});
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [grades, setGrades] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const recipients = watch("recipients");
  const recipientGroup = watch("recipientGroup");
  const message = watch("message");
  const schoolId = (window as any).CURRENT_SCHOOL_ID || "DEFAULT_SCHOOL";

  // Load grades from backend
  React.useEffect(() => {
    const loadGrades = async () => {
      setLoadingGrades(true);
      try {
        const response = await ApiService.getGrades({ page: 1, limit: 100 });
        setGrades(response.data || []);
      } catch (err) {
        console.error("Failed to load grades:", err);
      } finally {
        setLoadingGrades(false);
      }
    };

    loadGrades();
  }, []);

  // Load recipient groups from backend
 React.useEffect(() => {
  const loadRecipientGroups = async () => {
    setLoadingGroups(true);
    try {
      const gradeFilter = selectedGrade !== "all" ? selectedGrade : undefined;

      const resp = await smsApi.getRecipientGroups(schoolId, gradeFilter);
      const data = resp.data;

      setRecipientGroups({
        parents: {
          name: "Parents",
          count: data.parents.total,
          phones: data.parents.phones,
        },
        students: {
          name: "Students",
          count: data.students.count,
          phones: data.students.phones,
        },
        staff: {
          name: "Staff",
          count: data.staff.count,
          phones: data.staff.phones,
        },
      });
    } catch (err) {
      console.error("Failed to load recipient groups:", err);
      setNotification({
        type: "error",
        message: "Failed to load recipient groups",
      });
    } finally {
      setLoadingGroups(false);
    }
  };

  loadRecipientGroups();
}, [schoolId, selectedGrade]);


  React.useEffect(() => {
    const manualCount = recipients
      ?.split(/[,\n;]/)
      .map((r) => r.trim())
      .filter(Boolean).length || 0;

    const groupCount = recipientGroup
      ? recipientGroups[recipientGroup]?.count || 0
      : 0;

    setRecipientCount(manualCount + groupCount);
  }, [recipients, recipientGroup, recipientGroups]);

  React.useEffect(() => {
  reset({ recipientGroup: "" });
  setRecipientCount(0);
}, [selectedGrade]);

  const onSubmit = async (data: SendSMSForm) => {
    setSending(true);
    setNotification(null); // Clear any previous notifications
    
    try {
      let recipientList: string[] = [];

      // Add selected group recipients
      if (data.recipientGroup && recipientGroups[data.recipientGroup]) {
        recipientList = [
          ...recipientList,
          ...recipientGroups[data.recipientGroup].phones,
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

      // Remove duplicates and clean phone numbers
      recipientList = [...new Set(recipientList.map(phone => phone.replace(/[\s\-()]/g, "")))];

      if (recipientList.length === 0) {
        throw new Error("No valid recipients after cleaning phone numbers");
      }
      const resp = await smsApi.sendSMS({
        schoolId,
        senderId: "ELIMURISE",
        body: data.message,
        recipients: recipientList,
      });

      setNotification({
        type: "success",
        message: `SMS queued successfully! Message ID: ${
          resp.data.providerResp?.requestId || "N/A"
        }`,
      });
      reset();
      setRecipientCount(0);
      setSelectedGrade("all");

      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error("Send SMS error:", err);
      
      // Extract error details from response
      const errorData = err?.response?.data || {};
      const errorMessage = errorData.message || err.message || "Failed to send SMS";
      const balance = errorData.balance;
      const required = errorData.required;
      
      // Build detailed error message for insufficient tokens
      let fullErrorMessage = errorMessage;
      if (balance !== undefined && required !== undefined) {
        fullErrorMessage = `${errorMessage} Current balance: ${balance} tokens. Required: ${required} tokens.`;
      }
      
      setNotification({
        type: "error",
        message: fullErrorMessage,
      });
      
      // Don't auto-dismiss critical errors like insufficient balance
      // Keep them visible so user can see the issue
      if (errorMessage.toLowerCase().includes("insufficient")) {
        // Keep error visible for 10 seconds for insufficient balance errors
        setTimeout(() => setNotification(null), 10000);
      } else {
        // Auto-dismiss other errors after 6 seconds
        setTimeout(() => setNotification(null), 6000);
      }
    } finally {
      setSending(false);
    }
  };


  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Send SMS Multiple</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          {/* Error/Success Notification - Positioned at top of form box */}
          {notification && (
            <div className="mb-6">
              <div
                className={`p-4 rounded-lg border ${
                  notification.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <Lucide
                    icon={notification.type === "success" ? "CheckCircle" : "AlertCircle"}
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      notification.type === "error" ? "text-red-600" : "text-green-600"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">
                      {notification.type === "success" ? "Success!" : "Error"}
                    </p>
                    <p className="text-sm whitespace-pre-line">{notification.message}</p>
                    {notification.type === "error" && (
                      <p className="text-xs mt-2 text-red-600">
                        Please check your SMS balance and try again, or purchase more tokens.
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotification(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="box-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                     {/* Grade Selector - Always visible */}
                <div>
                  <FormLabel htmlFor="grade">
                    Select Grade (Optional)
                  </FormLabel>
                  <FormSelect
                    id="grade"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    disabled={loadingGrades || loadingGroups}
                  >
                    <option value="all">All Grades</option>
                    {grades.map((grade) => (
                      <option key={grade._id} value={grade._id}>
                        {grade.name}
                      </option>
                    ))}
                  </FormSelect>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedGrade === "all"
                    ? "All grades included"
                    : `Filtering by: ${grades.find(g => g._id === selectedGrade)?.name}`}
                </p>

                </div>

                {/* Recipient Group Dropdown */}
                <div>
                  <FormLabel htmlFor="recipientGroup">
                    Select Recipient Group (Optional)
                  </FormLabel>
                 <FormSelect
                    id="recipientGroup"
                    {...register("recipientGroup")}
                    disabled={loadingGroups || !selectedGrade}
                  >
                    <option value="">-- Select a group --</option>
                    {Object.entries(recipientGroups).map(([key, group]) => (
                      <option key={key} value={key}>
                        {group.name} ({group.count} recipients)
                      </option>
                    ))}
                  </FormSelect>
                  <p className="text-xs text-gray-500 mt-1">
                    {loadingGroups
                      ? "Loading groups..."
                      : recipientGroup
                      ? `Selected: ${recipientGroups[recipientGroup]?.name}`
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
                {recipientGroup && recipientGroups[recipientGroup] && (
                  <div className="sm:col-span-2">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex gap-2 text-sm">
                        <Lucide icon="AlertCircle" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-700">
                          <strong>{recipientGroups[recipientGroup]?.name}</strong> group ({recipientGroups[recipientGroup]?.count} recipients) will be included.
                          {recipientGroup === "students" && selectedGrade !== "all" && (
                            <> Filtered by grade: <strong>{grades.find((g) => g._id === selectedGrade)?.name || "Grade"}</strong>.</>
                          )}
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
                    setSelectedGrade("all");
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
