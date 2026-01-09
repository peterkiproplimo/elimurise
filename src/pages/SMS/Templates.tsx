import React, { useEffect, useState } from "react";
import axios from "axios";

import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";

/* =====================
   CONFIG
===================== */
const API_BASE = "http://localhost:5001/api/smstemplates";

/* =====================
   TYPES
===================== */
interface SmsTemplate {
  id: number;
  templateName: string;
  messageTemplate: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
}

/* =====================
   COMPONENT
===================== */
export default function Templates() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  /* =====================
     LOAD TEMPLATES
  ===================== */
  const loadTemplates = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(
        `${API_BASE}/sms/templates`,
        { withCredentials: true }
      );

      setTemplates(resp.data || []);
    } catch (err) {
      console.error("Failed to load templates", err);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     STATUS BADGE
  ===================== */
  const getStatusBadge = (approved: boolean) =>
    approved ? (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Approved
      </span>
    ) : (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
    );

  /* =====================
     UI
  ===================== */
  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">SMS Templates</h2>
        <Button
          onClick={loadTemplates}
          variant="outline-primary"
          className="flex items-center gap-2"
        >
          <Lucide icon="RefreshCw" className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          <div className="box-body">
            {loading ? (
              <div className="flex justify-center py-12">
                <Lucide
                  icon="Loader"
                  className="w-8 h-8 animate-spin text-blue-600"
                />
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <Lucide
                  icon="Mail"
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                />
                <p className="text-gray-600">No templates found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <Table.Thead className="bg-gray-50 border-b border-gray-200">
                    <Table.Tr>
                      <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Template Name
                      </Table.Th>
                      <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Message
                      </Table.Th>
                      <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Status
                      </Table.Th>
                      <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Created
                      </Table.Th>
                      <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                        Action
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {templates.map((tpl) => (
                      <Table.Tr
                        key={tpl.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <Table.Td className="px-4 py-3 font-medium text-gray-900">
                          {tpl.templateName}
                        </Table.Td>

                        <Table.Td className="px-4 py-3 text-sm text-gray-600">
                          <div
                            className="max-w-xs truncate"
                            title={tpl.messageTemplate}
                          >
                            {tpl.messageTemplate}
                          </div>
                        </Table.Td>

                        <Table.Td className="px-4 py-3">
                          {getStatusBadge(tpl.isApproved)}
                        </Table.Td>

                        <Table.Td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(tpl.createdAt).toLocaleDateString()}
                        </Table.Td>

                        <Table.Td className="px-4 py-3">
                          <Button
                            variant="outline-primary"
                            className="text-xs"
                          >
                            <Lucide icon="Edit2" className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
