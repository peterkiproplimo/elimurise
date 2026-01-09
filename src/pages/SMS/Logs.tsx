import React, { useEffect, useState } from "react";
import smsApi from "../../services/smsApi";
import {
  FormInput,
  FormLabel,
} from "../../base-components/Form";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";

export default function Logs() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const schoolId = (window as any).CURRENT_SCHOOL_ID || "DEFAULT_SCHOOL";

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const resp = await smsApi.getMessages(schoolId);
      setMessages(resp.data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; bgColor: string }
    > = {
      pending: { color: "text-yellow-700", bgColor: "bg-yellow-100" },
      sent: { color: "text-blue-700", bgColor: "bg-blue-100" },
      delivered: { color: "text-green-700", bgColor: "bg-green-100" },
      failed: { color: "text-red-700", bgColor: "bg-red-100" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.senderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Lucide icon="Loader" className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">SMS Message Logs</h2>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          <div className="box-body">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Message History
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  View and manage all SMS messages sent
                </p>
              </div>
              <Button
                onClick={loadMessages}
                className="flex items-center gap-2"
                variant="outline-primary"
              >
                <Lucide icon="RefreshCw" className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-sm text-gray-600">Total Messages</div>
                <div className="text-2xl font-bold text-blue-600">
                  {messages.length}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="text-sm text-gray-600">Delivered</div>
                <div className="text-2xl font-bold text-green-600">
                  {messages.filter((m) => m.status === "delivered").length}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {messages.filter((m) => m.status === "pending").length}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="text-sm text-gray-600">Failed</div>
                <div className="text-2xl font-bold text-red-600">
                  {messages.filter((m) => m.status === "failed").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          <div className="box-body">
            <FormLabel htmlFor="search">Search Messages</FormLabel>
            <FormInput
              id="search"
              type="text"
              placeholder="Search by message content or sender ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="box">
          <div className="box-body">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Lucide
                  icon="Mail"
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                />
                <p className="text-gray-600">No messages found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <Table.Thead className="bg-gray-50 border-b border-gray-200">
                      <Table.Tr>
                        <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Message
                        </Table.Th>
                        <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Status
                        </Table.Th>
                        <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Sender
                        </Table.Th>
                        <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Date
                        </Table.Th>
                        <Table.Th className="px-4 py-3 text-left text-xs font-medium text-gray-700">
                          Action
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paginatedMessages.map((msg) => (
                        <Table.Tr
                          key={msg._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <Table.Td className="px-4 py-3 text-sm text-gray-900">
                            <div className="max-w-xs truncate" title={msg.body}>
                              {msg.body}
                            </div>
                          </Table.Td>
                          <Table.Td className="px-4 py-3 text-sm">
                            {getStatusBadge(msg.status)}
                          </Table.Td>
                          <Table.Td className="px-4 py-3 text-sm text-gray-600">
                            {msg.senderId || "SCHOOL"}
                          </Table.Td>
                          <Table.Td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(msg.createdAt).toLocaleDateString()}{" "}
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </Table.Td>
                          <Table.Td className="px-4 py-3 text-sm">
                            <Button
                              onClick={() => setSelectedMessage(msg)}
                              variant="outline-primary"
                              className="text-xs"
                            >
                              <Lucide icon="Eye" className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center gap-2 items-center">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Message Details
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <span className="font-semibold text-gray-700 text-sm">
                  Message:
                </span>
                <p className="text-gray-600 mt-2 p-3 bg-gray-50 rounded border border-gray-200 break-words text-sm">
                  {selectedMessage.body}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 text-sm">
                  Status:
                </span>
                <div className="mt-2">{getStatusBadge(selectedMessage.status)}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 text-sm">
                  Sender ID:
                </span>
                <p className="text-gray-600 mt-1 text-sm">
                  {selectedMessage.senderId || "SCHOOL"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700 text-sm">
                  Sent At:
                </span>
                <p className="text-gray-600 mt-1 text-sm">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              {selectedMessage.providerMessageId && (
                <div>
                  <span className="font-semibold text-gray-700 text-sm">
                    Provider ID:
                  </span>
                  <p className="text-gray-600 mt-1 text-xs break-all">
                    {selectedMessage.providerMessageId}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => setSelectedMessage(null)}
                variant="outline-secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
