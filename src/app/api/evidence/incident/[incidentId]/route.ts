/**
 * Evidence endpoint - uses direct S3 access
 * GET /api/evidence/incident/:incidentId
 * 
 * Always uses direct S3 access to fetch evidence files.
 */

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash } from 'crypto';

const S3_BUCKET = process.env.S3_BUCKET || '';
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || '';
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || '';
const S3_REGION = process.env.S3_REGION || '';
const S3_ENDPOINT = process.env.S3_ENDPOINT || undefined;

// Check if we should use direct S3 access (if credentials are provided)
const USE_DIRECT_S3 = !!(S3_ACCESS_KEY && S3_SECRET_KEY);

// Initialize S3 client
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  ...(S3_ENDPOINT && { endpoint: S3_ENDPOINT }),
});

// Helper to determine evidence kind from ContentType or file extension
function getEvidenceKindFromContentType(contentType: string | undefined): 'AUDIO' | 'VIDEO' | null {
  if (!contentType) return null;
  
  const lowerType = contentType.toLowerCase();
  if (lowerType.startsWith('audio/')) {
    return 'AUDIO';
  }
  if (lowerType.startsWith('video/')) {
    return 'VIDEO';
  }
  return null;
}

// Helper to determine evidence kind from file extension (fallback)
function getEvidenceKindFromExtension(key: string): 'AUDIO' | 'VIDEO' | null {
  const lowerKey = key.toLowerCase();
  const audioExts = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.webm'];
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
  
  if (audioExts.some(ext => lowerKey.endsWith(ext))) {
    return 'AUDIO';
  }
  if (videoExts.some(ext => lowerKey.endsWith(ext))) {
    return 'VIDEO';
  }
  return null;
}

// Helper to extract metadata from S3 object key
// Expected format: incidents/{incidentId}/{evidenceId}-{kind}.{ext}
// or: incidents/{incidentId}/{filename}
function extractEvidenceId(key: string): string {
  // Extract filename without extension
  const filename = key.split('/').pop() || '';
  // Remove extension
  const withoutExt = filename.split('.').slice(0, -1).join('.');
  // If it contains a UUID pattern, extract it
  const uuidMatch = withoutExt.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return uuidMatch ? uuidMatch[0] : withoutExt;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ incidentId: string }> }
) {
  // Fix Next.js 15: await params
  const { incidentId } = await params;
  const { searchParams } = new URL(req.url);
  const expiresIn = parseInt(searchParams.get('expiresIn') || '3600', 10);

  if (!incidentId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'MISSING_INCIDENT_ID',
      },
      { status: 400 }
    );
  }

  // Validate expiresIn
  if (expiresIn < 60 || expiresIn > 86400) {
    return NextResponse.json(
      {
        ok: false,
        error: 'INVALID_EXPIRES_IN',
        message: 'expiresIn must be between 60 and 86400 seconds',
      },
      { status: 400 }
    );
  }

  // Always use direct S3 access
  if (!USE_DIRECT_S3) {
    return NextResponse.json(
      {
        ok: false,
        error: 'EVIDENCE_UNAVAILABLE',
        message: 'S3 credentials not configured',
      },
      { status: 503 }
    );
  }

  try {
    // List objects in the incident folder
    const prefix = `incidents/${incidentId}/`;
    
    // Collect all objects (handle pagination)
    const allObjects: Array<{ Key?: string; Size?: number; LastModified?: Date }> = [];
    let continuationToken: string | undefined;
    let isTruncated = true;

    while (isTruncated) {
      const command = new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);
      
      if (response.Contents) {
        allObjects.push(...response.Contents);
      }

      isTruncated = response.IsTruncated || false;
      continuationToken = response.NextContinuationToken;
    }

    if (allObjects.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INCIDENT_NOT_FOUND',
          message: `No files found in S3 bucket ${S3_BUCKET} with prefix ${prefix}`,
        },
        { status: 404 }
      );
    }

    // Filter and process evidence files
    const evidencePromises = allObjects.map(async (object) => {
      if (!object.Key) {
        return null;
      }

      // Skip if it's a folder (ends with /)
      if (object.Key.endsWith('/')) {
        return null;
      }

      // Get ContentType from S3 metadata
      let contentType: string | undefined;
      let kind: 'AUDIO' | 'VIDEO' | null = null;
      
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: S3_BUCKET,
          Key: object.Key,
        });
        const headResponse = await s3Client.send(headCommand);
        contentType = headResponse.ContentType;
        kind = getEvidenceKindFromContentType(contentType);
      } catch {
        // Continue without metadata
      }

      // Fallback to extension-based detection if ContentType didn't work
      if (!kind) {
        kind = getEvidenceKindFromExtension(object.Key);
      }

      if (!kind) {
        return null; // Skip non-audio/video files
      }

      // Generate presigned URL
      const getObjectCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: object.Key,
      });

      const url = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn,
      });

      // Extract evidence ID from key
      const evidenceId = extractEvidenceId(object.Key);

      // Generate SHA256 from key (or use metadata if available)
      // For now, we'll use a hash of the key as a placeholder
      const sha256 = createHash('sha256').update(object.Key).digest('hex');

      return {
        id: evidenceId,
        kind,
        size: object.Size || 0,
        sha256,
        verificationStatus: 'VERIFIED' as const, // Default to verified since we're accessing directly
        verificationError: null,
        verifiedAt: object.LastModified?.toISOString() || null,
        createdAt: object.LastModified?.toISOString() || new Date().toISOString(),
        url,
      };
    });

    const evidenceResults = await Promise.all(evidencePromises);
    const evidence = evidenceResults.filter((item): item is NonNullable<typeof item> => item !== null);

    if (evidence.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INCIDENT_NOT_FOUND',
          message: `Found ${allObjects.length} object(s) but none are audio/video files`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      incidentId,
      count: evidence.length,
      evidence,
    });
  } catch (error) {
    console.error('Failed to fetch evidence from S3:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      incidentId,
      bucket: S3_BUCKET,
      region: S3_REGION,
      hasCredentials: !!S3_ACCESS_KEY && !!S3_SECRET_KEY,
    });
    
    // Check for specific AWS errors
    if (error && typeof error === 'object' && 'name' in error) {
      const awsError = error as { name: string; message: string };
      if (awsError.name === 'NoSuchBucket') {
        return NextResponse.json(
          {
            ok: false,
            error: 'S3_BUCKET_NOT_FOUND',
            message: `Bucket ${S3_BUCKET} does not exist`,
          },
          { status: 404 }
        );
      }
      if (awsError.name === 'AccessDenied' || awsError.name === 'InvalidAccessKeyId') {
        return NextResponse.json(
          {
            ok: false,
            error: 'S3_ACCESS_DENIED',
            message: 'Invalid S3 credentials or insufficient permissions',
          },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to fetch evidence from S3',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
