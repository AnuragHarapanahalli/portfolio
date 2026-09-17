import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing target URL parameter', status: 'error' },
      { status: 400 }
    );
  }

  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: 'Invalid URL protocol', status: 'error' },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Malformed target URL', status: 'error' },
      { status: 400 }
    );
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'IllocaPortfolio-RenderWarmer/1.0',
        'Accept': '*/*',
      },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    // Render free instances return 502/503 during cold starts or container provisioning
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      return NextResponse.json({
        status: 'warming',
        latencyMs,
        statusCode: response.status,
        message: 'Render container is currently spinning up',
      });
    }

    if (response.ok || response.status < 400 || response.status === 401 || response.status === 403 || response.status === 404) {
      // Container responded — it is warm and executing HTTP traffic!
      return NextResponse.json({
        status: 'online',
        latencyMs,
        statusCode: response.status,
        message: 'Service is warm and responsive',
      });
    }

    return NextResponse.json({
      status: 'error',
      latencyMs,
      statusCode: response.status,
      message: `HTTP ${response.status}`,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (err.name === 'AbortError') {
      return NextResponse.json({
        status: 'warming',
        latencyMs,
        message: 'Render container boot in progress (request timeout)',
      });
    }

    // Network error or connection refused while waking
    return NextResponse.json({
      status: 'warming',
      latencyMs,
      message: 'Initial connection packet sent to Render',
    });
  }
}
