'use client';

import React, { useState, useEffect } from 'react';
import { Evidence, EvidenceResponse } from '@/lib/types';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import StatusPill from './StatusPill';

export interface EvidenceModalProps {
  incidentId: string;
  isOpen: boolean;
  onClose: () => void;
  expiresIn?: number;
}

async function fetchIncidentEvidence(
  incidentId: string,
  expiresIn: number = 3600
): Promise<EvidenceResponse> {
  const response = await fetch(
    `/api/evidence/incident/${incidentId}?expiresIn=${expiresIn}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch evidence');
  }

  return response.json();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export function EvidenceModal({ incidentId, isOpen, onClose, expiresIn = 3600 }: EvidenceModalProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadEvidence() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchIncidentEvidence(incidentId, expiresIn);
        setEvidence(response.evidence);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, [incidentId, expiresIn, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal panel - centered */}
      <div className="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-300 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                Incident Evidence
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">Incident ID: {incidentId.slice(0, 8)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition-colors duration-200 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto bg-gray-50 flex-1">
              {loading && (
                <div className="p-6">
                  <LoadingState type="skeleton" message="Loading evidence..." />
                </div>
              )}

              {error && (
                <div className="p-6">
                  <ErrorState
                    message={error}
                    onRetry={() => {
                      setError(null);
                      setLoading(true);
                      fetchIncidentEvidence(incidentId, expiresIn)
                        .then((response) => {
                          setEvidence(response.evidence);
                          setLoading(false);
                        })
                        .catch((err) => {
                          setError(err instanceof Error ? err.message : 'Unknown error');
                          setLoading(false);
                        });
                    }}
                  />
                </div>
              )}

              {!loading && !error && evidence.length === 0 && (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Media Evidence</h3>
                  <p className="text-sm text-gray-600">
                    No audio or video evidence has been uploaded for this incident yet.
                  </p>
                </div>
              )}

              {!loading && !error && evidence.length > 0 && (
                <div className="p-6 space-y-6">
                  {/* Separate containers for Video and Audio files */}
                  
                  {/* Video Files Container */}
                  {evidence.filter((e) => e.kind === 'VIDEO').length > 0 && (
                    <div className="bg-white border-2 border-blue-300 rounded-xl p-5 shadow-lg">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Video Files</h4>
                          <p className="text-xs text-gray-600">
                            {evidence.filter((e) => e.kind === 'VIDEO').length} video file{evidence.filter((e) => e.kind === 'VIDEO').length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {evidence
                          .filter((e) => e.kind === 'VIDEO')
                          .map((item, index) => {
                            const isExpanded = expandedVideoId === item.id;
                            return (
                              <div
                                key={item.id}
                                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                                      VIDEO #{index + 1}
                                    </span>
                                    <StatusPill
                                      value={item.verificationStatus.toLowerCase() as 'pending' | 'verified' | 'failed' | 'error'}
                                    />
                                    <span className="text-xs text-gray-600">{formatFileSize(item.size)}</span>
                                    <span className="text-xs text-gray-500">
                                      Created: {formatRelativeTime(item.createdAt)}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setExpandedVideoId(isExpanded ? null : item.id)}
                                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5"
                                    aria-label={isExpanded ? 'Collapse video' : 'Expand video'}
                                  >
                                    {isExpanded ? (
                                      <>
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                                        </svg>
                                        Collapse
                                      </>
                                    ) : (
                                      <>
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                        Expand
                                      </>
                                    )}
                                  </button>
                                </div>
                                {/* Video Container - Consistent Size */}
                                <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
                                  <video
                                    key={`video-${item.id}-${item.url.slice(-20)}`}
                                    controls
                                    preload="metadata"
                                    playsInline
                                    className="w-full h-full object-contain"
                                    src={item.url}
                                    onError={(e) => {
                                      const video = e.currentTarget;
                                      if (video.error) {
                                        console.error('Video load error:', {
                                          code: video.error.code,
                                          message: video.error.message,
                                        });
                                      }
                                    }}
                                  >
                                    Your browser does not support the video element.
                                  </video>
                                </div>
                                {item.verificationError && (
                                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                    Error: {item.verificationError}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Expanded Video Overlay */}
                  {expandedVideoId && (
                    <div
                      className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-4"
                      onClick={() => setExpandedVideoId(null)}
                    >
                      <button
                        onClick={() => setExpandedVideoId(null)}
                        className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-white min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-all duration-200"
                        aria-label="Close expanded video"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div
                        className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {evidence
                          .filter((e) => e.kind === 'VIDEO' && e.id === expandedVideoId)
                          .map((item) => (
                            <video
                              key={`expanded-video-${item.id}`}
                              controls
                              autoPlay
                              preload="metadata"
                              playsInline
                              className="w-full h-full max-w-full max-h-full object-contain rounded-lg"
                              src={item.url}
                              onError={(e) => {
                                const video = e.currentTarget;
                                if (video.error) {
                                  console.error('Video load error:', {
                                    code: video.error.code,
                                    message: video.error.message,
                                  });
                                }
                              }}
                            >
                              Your browser does not support the video element.
                            </video>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Audio Files Container */}
                  {evidence.filter((e) => e.kind === 'AUDIO').length > 0 && (
                    <div className="bg-white border-2 border-green-300 rounded-xl p-5 shadow-lg">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-green-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">Audio Files</h4>
                          <p className="text-xs text-gray-600">
                            {evidence.filter((e) => e.kind === 'AUDIO').length} audio file{evidence.filter((e) => e.kind === 'AUDIO').length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {evidence
                          .filter((e) => e.kind === 'AUDIO')
                          .map((item, index) => (
                            <div
                              key={item.id}
                              className="bg-green-50 border-2 border-green-200 rounded-lg p-4"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                                  AUDIO #{index + 1}
                                </span>
                                <StatusPill
                                  value={item.verificationStatus.toLowerCase() as 'pending' | 'verified' | 'failed' | 'error'}
                                />
                                <span className="text-xs text-gray-600">{formatFileSize(item.size)}</span>
                                <span className="text-xs text-gray-500">
                                  Created: {formatRelativeTime(item.createdAt)}
                                </span>
                              </div>
                              <audio
                                key={`audio-${item.id}-${item.url.slice(-20)}`}
                                controls
                                preload="metadata"
                                className="w-full"
                                src={item.url}
                                onError={(e) => {
                                  const audio = e.currentTarget;
                                  if (audio.error) {
                                    console.error('Audio load error:', {
                                      code: audio.error.code,
                                      message: audio.error.message,
                                    });
                                  }
                                }}
                              >
                                Your browser does not support the audio element.
                              </audio>
                              {item.verificationError && (
                                <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                  Error: {item.verificationError}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
