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
  return `<!doctype html><html><body><script>window.opener.postMessage(${message}, '*');</script><p>Authorization complete. You can close this window.</p></body></html>`
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const { clientId, clientSecret, baseUrl } = getConfig()
    const hasCode = typeof request.query.code === 'string' && request.query.code.length > 0
    const action = hasCode ? 'callback' : 'authorize'
    const callbackUrl = `${baseUrl}/api/auth`
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

    const code = typeof request.query.code === 'string' ? request.query.code : ''
    if (!code) return response.status(400).send(callbackPage('error', { error: 'Missing code' }))
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callbackUrl }),
    })
    const token = (await tokenResponse.json()) as { access_token?: string; error?: string }
    if (!token.access_token) return response.status(502).send(callbackPage('error', { error: token.error || 'OAuth token exchange failed' }))
    return response.status(200).setHeader('Content-Type', 'text/html').send(callbackPage('success', { token: token.access_token }))
  } catch (error) {
    return response.status(500).send(callbackPage('error', { error: error instanceof Error ? error.message : 'OAuth configuration error' }))
  }
}
