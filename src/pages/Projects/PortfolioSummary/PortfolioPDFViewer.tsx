import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import Button from '../../../base-components/Button';
import Card from '../../../base-components/Card';
import { Download, Eye, ArrowLeft, Loader2 } from 'lucide-react';

// Import PDF document directly for download link (no lazy loading for downloads)
import PortfolioPDFDocumentComprehensive from './PortfolioPDFDocumentComprehensive';

interface PortfolioPDFViewerProps {
  portfolioData?: any;
  onBack?: () => void;
}

const PortfolioPDFViewer: React.FC<PortfolioPDFViewerProps> = ({ portfolioData: propData, onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [isViewerReady, setIsViewerReady] = useState(false);

  // Memoize portfolio data to prevent unnecessary re-renders
  const memoizedPortfolioData = useMemo(() => {
    return propData || location.state?.portfolioData;
  }, [propData, location.state]);

  useEffect(() => {
    // Get portfolio data from props or location state
    if (memoizedPortfolioData) {
      console.log('Portfolio data loaded:', memoizedPortfolioData);
      setPortfolioData(memoizedPortfolioData);
      // Delay viewer loading for better UX
      setTimeout(() => setIsViewerReady(true), 100);
    } else {
      console.log('No portfolio data found, redirecting...');
      // If no data, redirect back to portfolio summary
      navigate('/portfolio-summary');
    }
  }, [memoizedPortfolioData, navigate]);

  const handleDownload = () => {
    setIsGenerating(true);
    // The download will be handled by PDFDownloadLink
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/portfolio-summary');
    }
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  // Loading component for PDF viewer
  const PDFLoadingComponent = () => (
    <div className="h-[800px] w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600" />
        <p className="text-gray-600 text-lg">Generating PDF Preview...</p>
        <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBack}
                variant="outline-secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio PDF</h1>
                <p className="text-gray-600">View and download the generated portfolio PDF</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PDFDownloadLink
                document={<PortfolioPDFDocumentComprehensive data={portfolioData} />}
                fileName={`portfolio-${portfolioData.student?.adm_no || 'unknown'}-${portfolioData.academicYear || '2024'}.pdf`}
                className="flex items-center gap-2"
              >
                {({ blob, url, loading, error }) => {
                  if (error) {
                    console.error('PDF generation error:', error);
                  }
                  return (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={loading || !!error}
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating PDF...
                        </>
                      ) : error ? (
                        <>
                          <Download className="h-4 w-4" />
                          Error - Retry
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  );
                }}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <div className="p-0">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Portfolio PDF Preview
              </h3>
            </div>
            <div className="h-[800px] w-full">
              {!isViewerReady ? (
                <PDFLoadingComponent />
              ) : (
                <PDFViewer
                  key={`pdf-viewer-${portfolioData.student?.adm_no || 'unknown'}-${Date.now()}`}
                  width="100%"
                  height="100%"
                  showToolbar={true}
                  className="border-0"
                >
                  <PortfolioPDFDocumentComprehensive data={portfolioData} />
                </PDFViewer>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPDFViewer;
