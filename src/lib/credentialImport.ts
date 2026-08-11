export interface ParsedCredential {
  name?: string;
  issuer?: string;
  description?: string;
  credentialUrl?: string;
  issueDate?: Date;
}

const decodeHtmlEntities = (text: string): string =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

/**
 * Parse un credential Open Badges 3.0 / W3C Verifiable Credential (format
 * exporté par Accredible/credential.net, utilisé par Coursera/Columbia+ et
 * d'autres plateformes MOOC). Gère les deux variantes vues en pratique : le
 * fichier "credential-ob3-*.json" (avec credentialSubject.achievement) et le
 * fichier "credential-w3cvc-*.json" (plus plat, avec completionDate).
 */
export function parseCredentialJson(raw: unknown): ParsedCredential {
  if (!raw || typeof raw !== 'object') return {};
  const data = raw as Record<string, any>;

  const achievement = data.credentialSubject?.achievement;
  const name: string | undefined = data.name || achievement?.name;
  const description: string | undefined = data.description || achievement?.description;
  const issuerName: string | undefined = data.issuer?.name;
  const credentialUrl: string | undefined = typeof data.id === 'string' ? data.id : undefined;
  const issueDateRaw: string | undefined = data.validFrom || data.completionDate;

  return {
    name,
    issuer: issuerName,
    description: description ? decodeHtmlEntities(description) : undefined,
    credentialUrl,
    issueDate: issueDateRaw ? new Date(issueDateRaw) : undefined,
  };
}
