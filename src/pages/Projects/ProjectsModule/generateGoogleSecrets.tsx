import React, { useState, useEffect, useRef } from "react";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Notification, {
  NotificationElement,
} from "../../../base-components/Notification";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../../base-components/LoadingIcon";

interface GoogleConfig {
  _id?: string;
  client_id?: string;
  client_secret?: string;
  api_key?: string;
  refresh_token?: string;
  access_token?: string;
  code?: string;
  redirect_uri?: string;
  scope?: string;
  description?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const GenerateGoogleSecrets = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<GoogleConfig | null>(null);
  const notificationRef = useRef<NotificationElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoogleConfig>();

  // Fetch current configuration on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  // Check for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleOAuthCallback(code);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}google-config`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setConfig(data.config);
          reset(data.config);
        }
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCredentials = async (data: GoogleConfig) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}google-config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setConfig(result.config);
        notificationRef.current?.showToast();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save credentials");
      }
    } catch (error: any) {
      console.error("Error saving credentials:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = async () => {
    try {
      // Get current config or use form values
      const currentConfig = config || {};
      const clientId = currentConfig.client_id || (document.getElementById('client_id') as HTMLInputElement)?.value;
      const redirectUri = currentConfig.redirect_uri || (document.getElementById('redirect_uri') as HTMLInputElement)?.value || 'http://localhost:5173/home/oauthclientredirect';
      const scope = currentConfig.scope || 'https://www.googleapis.com/auth/drive.file';

      if (!clientId) {
        alert('Please enter Client ID first');
        return;
      }

      // Save credentials first if not already saved
      if (!config) {
        const formData = {
          client_id: clientId,
          client_secret: (document.getElementById('client_secret') as HTMLInputElement)?.value || '',
          api_key: (document.getElementById('api_key') as HTMLInputElement)?.value || '',
          redirect_uri: redirectUri,
          scope: scope,
        };
        await handleSaveCredentials(formData);
      }

      // Generate OAuth URL
      const state = Math.random().toString(36).substring(7);
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scope,
        access_type: 'offline',
        prompt: 'consent',
        state: state
      });

      const authUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating authentication:", error);
      notificationRef.current?.showToast();
    }
  };

  const handleOAuthCallback = async (code: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}google-config/exchange-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        await fetchConfig(); // Refresh config
        notificationRef.current?.showToast();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to exchange code for tokens");
      }
    } catch (error: any) {
      console.error("Error exchanging code:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  const maskSensitiveValue = (value: string | undefined) => {
    if (!value) return 'Not set';
    if (value.length <= 10) return '****';
    return value.substring(0, 4) + '****' + value.substring(value.length - 4);
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Google API Credentials Management</h2>
      </div>

      <div className="mt-5">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h4 className="font-bold mb-4">Configure Google API Credentials</h4>
          
          {/* Authenticate with Google - Moved to top */}
          <div className="mb-6 pb-6 border-b">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Authenticate with Google</h4>
              <Button
                type="button"
                variant="primary"
                onClick={handleAuthenticate}
                disabled={loading || (!config?.client_id && !(document.getElementById('client_id') as HTMLInputElement)?.value)}
              >
                <Lucide icon="LogIn" className="w-4 h-4 mr-2" />
                Authenticate with Google
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Click the button above to authenticate and receive authorization code, access token, and refresh token.
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSaveCredentials)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormLabel htmlFor="client_id">Client ID *</FormLabel>
                <FormInput
                  id="client_id"
                  type="text"
                  placeholder="Enter Google OAuth Client ID"
                  {...register("client_id", { required: "Client ID is required" })}
                  defaultValue={config?.client_id || ""}
                />
                {errors.client_id && (
                  <div className="mt-1 text-danger">{String(errors.client_id.message)}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="client_secret">Client Secret *</FormLabel>
                <FormInput
                  id="client_secret"
                  type="password"
                  placeholder="Enter Google OAuth Client Secret"
                  {...register("client_secret", { required: "Client Secret is required" })}
                  defaultValue={config?.client_secret || ""}
                />
                {errors.client_secret && (
                  <div className="mt-1 text-danger">{String(errors.client_secret.message)}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="api_key">API Key</FormLabel>
                <FormInput
                  id="api_key"
                  type="text"
                  placeholder="Enter Google API Key (optional)"
                  {...register("api_key")}
                  defaultValue={config?.api_key || ""}
                />
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="redirect_uri">Redirect URI</FormLabel>
                <FormInput
                  id="redirect_uri"
                  type="text"
                  placeholder="http://localhost:5173/home/oauthclientredirect"
                  {...register("redirect_uri")}
                  defaultValue={config?.redirect_uri || "http://localhost:5173/home/oauthclientredirect"}
                />
              </div>

              <div className="sm:col-span-2">
                <FormLabel htmlFor="scope">Scope</FormLabel>
                <FormInput
                  id="scope"
                  type="text"
                  placeholder="https://www.googleapis.com/auth/drive.file"
                  {...register("scope")}
                  defaultValue={config?.scope || "https://www.googleapis.com/auth/drive.file"}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={fetchConfig}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <LoadingIcon icon="oval" className="w-4 h-4" /> : "Save Credentials"}
              </Button>
            </div>
          </form>
        </div>

        {/* Display Current Configuration */}
        {config && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-5">
            <h4 className="font-bold mb-4">Current Configuration</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FormLabel>Client ID</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                  {maskSensitiveValue(config.client_id)}
                </div>
              </div>

              <div>
                <FormLabel>Client Secret</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                  {maskSensitiveValue(config.client_secret)}
                </div>
              </div>

              <div>
                <FormLabel>API Key</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                  {maskSensitiveValue(config.api_key)}
                </div>
              </div>

              <div>
                <FormLabel>Redirect URI</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                  {config.redirect_uri || 'Not set'}
                </div>
              </div>

              <div>
                <FormLabel>Scope</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                  {config.scope || 'Not set'}
                </div>
              </div>

              <div>
                <FormLabel>Authorization Code</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm break-all">
                  {config.code ? maskSensitiveValue(config.code) : 'Not set'}
                </div>
              </div>

              <div>
                <FormLabel>Access Token</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm break-all">
                  {config.access_token ? maskSensitiveValue(config.access_token) : 'Not set'}
                </div>
              </div>

              <div>
                <FormLabel>Refresh Token</FormLabel>
                <div className="p-2 bg-gray-50 rounded border font-mono text-sm break-all">
                  {config.refresh_token ? maskSensitiveValue(config.refresh_token) : 'Not set'}
                </div>
              </div>

              {config.createdAt && (
                <div>
                  <FormLabel>Created At</FormLabel>
                  <div className="p-2 bg-gray-50 rounded border text-sm">
                    {new Date(config.createdAt).toLocaleString()}
                  </div>
                </div>
              )}

              {config.updatedAt && (
                <div>
                  <FormLabel>Updated At</FormLabel>
                  <div className="p-2 bg-gray-50 rounded border text-sm">
                    {new Date(config.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Notification getRef={(el) => { notificationRef.current = el; }} />
    </>
  );
};

export default GenerateGoogleSecrets;