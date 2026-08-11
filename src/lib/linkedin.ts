interface LinkedInCertificationLike {
  name: string;
  issuer: string;
  issueDate: Date | string;
  expiryDate?: Date | string | null;
  credentialUrl?: string | null;
  credentialId?: string | null;
}

/**
 * Construit le lien officiel "Add to Profile" de LinkedIn pour une certification.
 * Pas d'API ni d'OAuth : c'est un simple lien qui ouvre le formulaire d'ajout de
 * certification de LinkedIn pré-rempli, que l'utilisateur confirme lui-même.
 * Documentation informelle mais stable, utilisée par Coursera/Credly/Udemy etc.
 */
export function buildLinkedInAddCertificationUrl(cert: LinkedInCertificationLike): string {
  const issueDate = new Date(cert.issueDate);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: cert.name,
    organizationName: cert.issuer,
    issueYear: String(issueDate.getFullYear()),
    issueMonth: String(issueDate.getMonth() + 1),
  });

  if (cert.expiryDate) {
    const expiryDate = new Date(cert.expiryDate);
    params.set('expirationYear', String(expiryDate.getFullYear()));
    params.set('expirationMonth', String(expiryDate.getMonth() + 1));
  }
  if (cert.credentialUrl) params.set('certUrl', cert.credentialUrl);
  if (cert.credentialId) params.set('certId', cert.credentialId);

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
