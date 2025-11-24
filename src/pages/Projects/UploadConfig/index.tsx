import React, { useState, useEffect, useRef } from "react";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import {
  FormInput,
  FormLabel,
  FormTextarea,
  FormSwitch,
} from "../../../base-components/Form";
import Notification, { NotificationElement } from "../../../base-components/Notification";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Cloudinary Configuration Interface
interface CloudinaryConfig {
  _id?: string;
  cloud_name: string;
  api_key: string;
  api_secret: string;
  upload_preset?: string;
  folder?: string;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Validation Schema
const cloudinaryConfigSchema = yup.object({
  cloud_name: yup.string().required("Cloud name is required").min(3, "Cloud name must be at least 3 characters"),
  api_key: yup.string().required("API key is required").min(10, "API key must be at least 10 characters"),
  api_secret: yup.string().required("API secret is required").min(10, "API secret must be at least 10 characters"),
  upload_preset: yup.string().optional(),
  folder: yup.string().optional(),
  description: yup.string().optional(),
  is_active: yup.boolean().default(true)
});

const UploadConfig = () => {
  // Fixed Cloudinary configuration ID
  const CLOUDINARY_CONFIG_ID = "68f7c348416e0370007b0935";
  
  const [config, setConfig] = useState<CloudinaryConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const notificationRef = useRef<NotificationElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<CloudinaryConfig>({
    resolver: yupResolver(cloudinaryConfigSchema),
    defaultValues: {
      is_active: true
    }
  });

  const isActive = watch("is_active");

  // Fetch existing configuration
  useEffect(() => {
    fetchCloudinaryConfig();
  }, []);

  const fetchCloudinaryConfig = async () => {
    try {
      setLoading(true);
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:9000/api/';
      const url = `${apiEndpoint}cloudinary-config/${CLOUDINARY_CONFIG_ID}`;
      
      console.log('Fetching Cloudinary config from:', url);
      console.log('API Endpoint:', apiEndpoint);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        if (data.config) {
          setConfig(data.config);
          setIsEditMode(true);
          // Populate form with existing data
          reset(data.config);
        }
      } else if (response.status === 404) {
        // Configuration doesn't exist yet, show empty state
        console.log('Configuration not found (404)');
        setConfig(null);
        setIsEditMode(true); // Always true since we have a fixed ID
        reset({
          cloud_name: "",
          api_key: "",
          api_secret: "",
          upload_preset: "",
          folder: "",
          description: "",
          is_active: true
        });
      } else {
        console.error('Unexpected response status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error("Error fetching Cloudinary config:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CloudinaryConfig) => {
    try {
      setSaving(true);
      
      // Always use the specific ID for updates
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:9000/api/';
      const url = `${apiEndpoint}cloudinary-config/${CLOUDINARY_CONFIG_ID}`;
      const method = "PUT"; // Always update since we have a specific ID
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setConfig(result.config);
        setIsEditMode(true);
        setShowEditForm(false); // Close edit form after saving
        
        notificationRef.current?.showToast();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving Cloudinary config:", error);
      notificationRef.current?.showToast();
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      setTestLoading(true);
      setTestResult(null);
      
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:9000/api/';
      const response = await fetch(`${apiEndpoint}cloudinary-config/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cloud_name: watch("cloud_name"),
          api_key: watch("api_key"),
          api_secret: watch("api_secret")
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestResult("✅ Connection successful! Cloudinary credentials are valid.");
        notificationRef.current?.showToast();
      } else {
        setTestResult(`❌ Connection failed: ${result.message}`);
        notificationRef.current?.showToast();
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResult("❌ Connection failed: Network error");
      notificationRef.current?.showToast();
    } finally {
      setTestLoading(false);
    }
  };

  const resetForm = () => {
    reset({
      cloud_name: "",
      api_key: "",
      api_secret: "",
      upload_preset: "",
      folder: "",
      description: "",
      is_active: true
    });
    setTestResult(null);
    setShowEditForm(false); // Close edit form
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Lucide icon="Loader" className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="content">
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Cloudinary Configuration</h2>
      </div>

      {!showEditForm ? (
        // Configuration Display View
        <div className="intro-y box p-5 mt-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold">
                Current Cloudinary Configuration
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Configuration ID: {CLOUDINARY_CONFIG_ID}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowEditForm(true)}
            >
              <Lucide icon="Edit" className="w-4 h-4 mr-2" />
              Edit Configuration
            </Button>
          </div>

          {config ? (
            <div className="space-y-6">
              {/* Configuration Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Cloud Name</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {config.cloud_name || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {config.api_key ? `${config.api_key.substring(0, 8)}...` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Secret</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {config.api_secret ? '••••••••••••' : 'Not set'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Upload Preset</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {config.upload_preset || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Default Folder</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {config.folder || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        config.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {config.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {config.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {config.description}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Test Connection</h4>
                    <p className="text-sm text-gray-600">
                      Test your Cloudinary credentials
                    </p>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={testConnection}
                    disabled={testLoading || !config.cloud_name || !config.api_key || !config.api_secret}
                  >
                    {testLoading ? (
                      <Lucide icon="Loader" className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Lucide icon="Zap" className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                </div>

                {testResult && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    testResult.includes("✅") 
                      ? "bg-green-50 border border-green-200 text-green-800" 
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}>
                    <p className="text-sm font-medium">{testResult}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lucide icon="Cloud" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Configuration Found</h3>
              <p className="text-gray-600 mb-4">
                No Cloudinary configuration exists yet. Click "Edit Configuration" to set it up.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowEditForm(true)}
              >
                <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                Create Configuration
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Edit Form View
        <div className="intro-y box p-5 mt-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold">
                {config ? "Edit Cloudinary Configuration" : "Create Cloudinary Configuration"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure your Cloudinary settings for file uploads (ID: {CLOUDINARY_CONFIG_ID})
              </p>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowEditForm(false)}
            >
              <Lucide icon="X" className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cloud Name */}
          <div>
            <FormLabel htmlFor="cloud_name">Cloud Name *</FormLabel>
            <FormInput
              id="cloud_name"
              type="text"
              placeholder="Enter your Cloudinary cloud name"
              {...register("cloud_name")}
              className={errors.cloud_name ? "border-red-500" : ""}
            />
            {errors.cloud_name && (
              <p className="text-red-500 text-sm mt-1">{errors.cloud_name.message}</p>
            )}
          </div>

          {/* API Key */}
          <div>
            <FormLabel htmlFor="api_key">API Key *</FormLabel>
            <FormInput
              id="api_key"
              type="text"
              placeholder="Enter your Cloudinary API key"
              {...register("api_key")}
              className={errors.api_key ? "border-red-500" : ""}
            />
            {errors.api_key && (
              <p className="text-red-500 text-sm mt-1">{errors.api_key.message}</p>
            )}
          </div>

          {/* API Secret */}
          <div>
            <FormLabel htmlFor="api_secret">API Secret *</FormLabel>
            <FormInput
              id="api_secret"
              type="password"
              placeholder="Enter your Cloudinary API secret"
              {...register("api_secret")}
              className={errors.api_secret ? "border-red-500" : ""}
            />
            {errors.api_secret && (
              <p className="text-red-500 text-sm mt-1">{errors.api_secret.message}</p>
            )}
          </div>

          {/* Upload Preset */}
          <div>
            <FormLabel htmlFor="upload_preset">Upload Preset</FormLabel>
            <FormInput
              id="upload_preset"
              type="text"
              placeholder="Enter upload preset (optional)"
              {...register("upload_preset")}
            />
            <p className="text-gray-500 text-sm mt-1">
              Optional: Specify a default upload preset for unsigned uploads
            </p>
          </div>

          {/* Folder */}
          <div>
            <FormLabel htmlFor="folder">Default Folder</FormLabel>
            <FormInput
              id="folder"
              type="text"
              placeholder="Enter default folder name (optional)"
              {...register("folder")}
            />
            <p className="text-gray-500 text-sm mt-1">
              Optional: Default folder where files will be uploaded
            </p>
          </div>

          {/* Description */}
          <div>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormTextarea
              id="description"
              placeholder="Enter a description for this configuration (optional)"
              {...register("description")}
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <FormSwitch
              id="is_active"
              {...register("is_active")}
            />
            <FormLabel htmlFor="is_active" className="ml-3">
              Active Configuration
            </FormLabel>
          </div>
          <p className="text-gray-500 text-sm">
            Only one configuration can be active at a time
          </p>

          {/* Test Connection */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">Test Connection</h4>
                <p className="text-sm text-gray-600">
                  Test your Cloudinary credentials before saving
                </p>
              </div>
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={testConnection}
                disabled={testLoading || !watch("cloud_name") || !watch("api_key") || !watch("api_secret")}
              >
                {testLoading ? (
                  <Lucide icon="Loader" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Lucide icon="Zap" className="w-4 h-4 mr-2" />
                )}
                Test Connection
              </Button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg ${
                testResult.includes("✅") 
                  ? "bg-green-50 border border-green-200 text-green-800" 
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                <p className="text-sm font-medium">{testResult}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={resetForm}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? (
                <Lucide icon="Loader" className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lucide icon="Save" className="w-4 h-4 mr-2" />
              )}
              Update Configuration
            </Button>
          </div>
        </form>
        </div>
      )}

      <Notification getRef={(el) => (notificationRef.current = el)} className="flex" />
    </div>
  );
};

export default UploadConfig;