export function base64ToPem(base64Cert) {
	//   const certBuffer = Buffer.from(base64Cert, 'base64');
	//   const pemCert = certBuffer.toString('ascii');

	//   const pemBegin = '-----BEGIN CERTIFICATE-----\n';
	//   const pemEnd = '\n-----END CERTIFICATE-----\n';

	//   return pemBegin + pemCert + pemEnd;
	const MAX_PEM_LINE_LENGTH = 64;
	const certBody = base64Cert.match(/.{1,64}/g).join('\n');

	return `-----BEGIN CERTIFICATE-----\n${certBody}\n-----END CERTIFICATE-----`;
}
