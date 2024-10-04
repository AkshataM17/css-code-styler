'use client';

import { useState, useEffect } from 'react';
import { Loader2, Code2, Paintbrush, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';

export default function Home() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [cssOnly, setCssOnly] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSize, setPreviewSize] = useState('desktop');

  const getPreviewWidth = () => {
    switch (previewSize) {
      case 'mobile': return '320px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  const PreviewFrame = ({ code, title }) => {
    const iframeRef = useState(null);

    useEffect(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const document = iframe.contentDocument;
        document.open();
        document.write(code);
        document.close();
      }
    }, [code]);

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          {title === "Styled" && (
            <div className="flex space-x-2">
              <button
                onClick={() => setPreviewSize('mobile')}
                className={`p-2 rounded ${previewSize === 'mobile' ? 'bg-blue-500' : 'bg-gray-700'}`}
                title="Mobile view"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewSize('tablet')}
                className={`p-2 rounded ${previewSize === 'tablet' ? 'bg-blue-500' : 'bg-gray-700'}`}
                title="Tablet view"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewSize('desktop')}
                className={`p-2 rounded ${previewSize === 'desktop' ? 'bg-blue-500' : 'bg-gray-700'}`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="w-full overflow-auto bg-white rounded-lg border border-gray-700" style={{ maxWidth: '100%' }}>
          <div style={{ width: title === "Styled" ? getPreviewWidth() : '100%', transition: 'width 0.3s ease' }}>
            <iframe
              ref={iframeRef}
              className="w-full h-[500px]"
              title={title}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/style-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await response.json();
      setOutputCode(data.styledCode);
      setCssOnly(data.cssOnly);
      setShowPreview(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Code2 className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              AI Code Styler
            </h1>
          </div>
          <p className="text-gray-400 text-xl">
            Transform your HTML with responsive, cross-browser compatible CSS
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Code2 className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold">Input HTML</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <textarea
                  className="w-full h-[400px] p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 font-mono text-sm"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Paste your HTML code here..."
                />
                <button
                  type="submit"
                  disabled={loading || !inputCode}
                  className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center space-x-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Paintbrush className="w-4 h-4" />
                      <span>Style Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Paintbrush className="w-5 h-5 text-teal-400 mr-2" />
              <h2 className="text-xl font-semibold">Generated CSS</h2>
            </div>
            <div className="relative">
              <pre className="w-full h-[400px] p-4 rounded-lg bg-gray-800 border border-gray-700 overflow-auto font-mono text-sm">
                <code className="text-teal-300">
                  {cssOnly || 'Generated CSS will appear here...'}
                </code>
              </pre>
              {cssOnly && (
                <button
                  onClick={() => navigator.clipboard.writeText(cssOnly)}
                  className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition duration-200"
                >
                  Copy CSS
                </button>
              )}
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="mt-12">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-2xl font-semibold">Live Preview</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <PreviewFrame code={inputCode} title="Original" />
              <PreviewFrame code={outputCode} title="Styled" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}