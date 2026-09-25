import type { VercelRequest, VercelResponse } from './types'
function getConfig() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET
  const baseUrl = process.env.PUBLIC_SITE_URL
  if (!clientId || !clientSecret || !baseUrl) {
    throw new Error('Missing GitHub OAuth environment variables')
  }
  return { clientId, clientSecret, baseUrl: baseUrl.replace(/\/$/, '') }
}

function callbackPage(status: 'success' | 'error', payload: unknown): string {
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(payload)}`)
  const title = status === 'success' ? 'Authorization complete. You can close this window.' : 'Authorization failed. You can close this window.'
  const detail = status === 'error' && payload && typeof payload === 'object' && 'error' in payload ? String(payload.error) : ''
  return `<!doctype html><html><body><script>window.opener?.postMessage(${message}, '*');</script><p>${title}</p><p>${detail}</p></body></html>`
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const { clientId, clientSecret, baseUrl } = getConfig()
    const code = typeof request.query.code === 'string' ? request.query.code : ''
    const action = code.length > 0 ? 'callback' : 'authorize'
    const forwardedHost = request.headers['x-forwarded-host']
    const requestHost = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || request.headers.host
    const callbackBaseUrl = requestHost ? `https://${requestHost}` : baseUrl
    const callbackUrl = `${callbackBaseUrl}/api/auth`
    if (action === 'authorize') {
      const provider = typeof request.query.provider === 'string' ? request.query.provider : 'github'
      if (provider !== 'github') return response.status(400).send('Invalid provider')
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackUrl,
        scope: 'public_repo,user',
        state: crypto.randomUUID(),
      })
      return response.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callbackUrl }).toString(),
    })
    const token = (await tokenResponse.json()) as { access_token?: string; error?: string; error_description?: string }
    if (!tokenResponse.ok || !token.access_token) {
      const reason = token.error_description || token.error || `GitHub token exchange failed (${tokenResponse.status})`
      return response.status(502).setHeader('Content-Type', 'text/html').send(callbackPage('error', { error: reason }))
    }
    return response.status(200).setHeader('Content-Type', 'text/html').send(callbackPage('success', { token: token.access_token }))
  } catch (error) {
    return response.status(500).send(callbackPage('error', { error: error instanceof Error ? error.message : 'OAuth configuration error' }))
  }
}
