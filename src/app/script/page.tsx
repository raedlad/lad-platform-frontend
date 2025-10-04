"use client";

import React, { useState } from "react";

// Import the API utility
import api from "./script";

interface ApiResponse {
  data?: any;
  error?: string;
  status?: number;
  loading: boolean;
}

export default function ApiTestPage() {
  const [endpoint, setEndpoint] = useState("/api/test");
  const [method, setMethod] = useState<"GET" | "POST">("GET");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<ApiResponse>({ loading: false });

  const handleApiCall = async () => {
    setResponse({ loading: true });

    try {
      let result;

      if (method === "GET") {
        result = await api.get(endpoint);
      } else {
        const body = requestBody.trim() ? JSON.parse(requestBody) : undefined;
        result = await api.post(endpoint, body);
      }

      setResponse({
        data: result.data,
        loading: false,
      });
    } catch (error: any) {
      setResponse({
        error: error.message || "An error occurred",
        status: error.response?.status,
        loading: false,
      });
    }
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            API Test Interface
          </h1>
          <p className="text-gray-600">
            Test your API endpoints using the configured API client
          </p>
        </div>

        {/* Request Configuration */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Request Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as "GET" | "POST")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/endpoint"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {method === "POST" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body (JSON)
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{"key": "value"}'
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>
          )}

          <button
            onClick={handleApiCall}
            disabled={response.loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {response.loading ? "Sending Request..." : "Send Request"}
          </button>
        </div>

        <div className="border-t pt-6 mb-6"></div>

        {/* Response Display */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Response</h3>

          {response.loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          {response.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                  Error
                </span>
                {response.status && (
                  <span className="ml-2 text-red-800 font-medium">
                    Status: {response.status}
                  </span>
                )}
              </div>
              <pre className="text-red-700 whitespace-pre-wrap font-mono text-sm">
                {response.error}
              </pre>
            </div>
          )}

          {response.data && !response.loading && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
                  Success
                </span>
                <span className="ml-2 text-green-800 font-medium">
                  Response Data
                </span>
              </div>
              <pre className="text-green-700 whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
                {formatJson(response.data)}
              </pre>
            </div>
          )}

          {!response.loading && !response.error && !response.data && (
            <div className="text-center text-gray-500 p-8">
              No response yet. Click "Send Request" to test an endpoint.
            </div>
          )}
        </div>

        <div className="border-t pt-6"></div>

        {/* API Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            API Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-800">Base URL:</strong>
              <p className="text-gray-600 font-mono mt-1">
                {process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.lad.sa"}
              </p>
            </div>
            <div>
              <strong className="text-gray-800">Features:</strong>
              <ul className="text-gray-600 list-disc list-inside mt-1">
                <li>CSRF Token Handling</li>
                <li>Automatic Cookie Management</li>
                <li>Error Handling</li>
                <li>JSON Response Parsing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
