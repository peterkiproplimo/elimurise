import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../base-components/Card';
import Button from '../base-components/Button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import googleImageUploadService from '../services/googleImageUploadService';

const GoogleOAuthRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        localStorage.setItem('stateId', state);
        localStorage.setItem('codeId', code);
        
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setErrorMessage(error);
          return;
        }

        if (code) {
          console.log('Saving OAuth code and state to localStorage...');
          
          // Save code and state to localStorage
          localStorage.setItem('google_oauth_code', code);
          localStorage.setItem('stateId', state || '');
          localStorage.setItem('codeId', code);
          if (urlParams.get('state')) {
            localStorage.setItem('google_oauth_state', urlParams.get('state') || '');
          }
          
          console.log('Code and state saved to localStorage');
          
          // Exchange code for tokens
          console.log('Exchanging code for tokens...');
          const { access_token, refresh_token } = await googleImageUploadService.exchangeCodeForToken(code);
          
          console.log('Tokens received and stored in localStorage');
          
          setStatus('success');
          
          // Redirect to create project evidence page after OAuth
          setTimeout(() => {
            navigate('/googleauthenticate', { replace: true });
          }, 1000);
        } else {
          setStatus('error');
          setErrorMessage('No authorization code received');
        }
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-500" />
            <h2 className="text-xl font-semibold mb-2">Completing Authentication</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we connect to Google Drive...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <Button onClick={() => navigate('/projectsmodule/create')}>
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h2 className="text-xl font-semibold mb-2">Authentication Successful</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've successfully connected to Google Drive. Redirecting...
          </p>
          <Loader2 className="h-6 w-6 mx-auto animate-spin text-blue-500" />
        </div>
      </Card>
    </div>
  );
};

export default GoogleOAuthRedirect;
