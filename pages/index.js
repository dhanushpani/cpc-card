import { useEffect } from 'react';
import crypto from 'crypto';
import { useRouter } from 'next/router';
import { base64ToPem } from '@/lib/pem';

const CHARACTERS_FOR_SECRET = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()`;
const RSA_PUBLIC_KEY_CERT =
	process.env.NEXT_PUBLIC_RSA_KEY?.replace(/\\n/g, '\n') || '';
const AES_ALGORITHM = 'aes-256-cbc';
const INIT_VECT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function Home() {
	const router = useRouter();
	const generateRandomString = (keyLength) => {
		// Generate a radom character string of specified length
		let generatedString = '';
		for (let i = 0; i < keyLength; i++) {
			const randomNum = Math.floor(
				Math.random() * CHARACTERS_FOR_SECRET.length
			);
			generatedString += CHARACTERS_FOR_SECRET.substring(
				randomNum,
				randomNum + 1
			);
		}
		return generatedString;
	};

	const aesEncryption = (payload, aesKey) => {
		const cipherdata = crypto.createCipheriv(
			AES_ALGORITHM,
			Buffer.from(aesKey),
			Buffer.from(INIT_VECT)
		);
		let encyptedPayload = cipherdata.update(payload, 'utf8', 'base64');
		encyptedPayload += cipherdata.final('base64');
		return encyptedPayload;
	};

	const getPemCert = async (base64Certificate) => {
		try {
			const pemCert = await base64ToPem(base64Certificate);
			return pemCert;
		} catch (error) {
			console.log(error, 'error');
		}
	};

	const rsaEncryption = async (aesKey) => {
		let base64Certificate =
			'MIIERzCCAy+gAwIBAgIIRkJL3X2j2skwDQYJKoZIhvcNAQELBQAwcTELMAkGA1UEBhMCSU4xCzAJBgNVBAgMAk1IMQ8wDQYDVQQHDAZNdW5iYWkxDTALBgNVBAoMBEF4aXMxEjAQBgNVBAsMCUF4aXMgQmFuazEhMB8GA1UEAwwYcmd3Lmp3ZWp3cy51YXQuYXhpc2IuY29tMB4XDTIzMDEwMzA1MzM0MloXDTI4MDEwMjA1MzM0MlowcTELMAkGA1UEBhMCSU4xCzAJBgNVBAgMAk1IMQ8wDQYDVQQHDAZNdW5iYWkxDTALBgNVBAoMBEF4aXMxEjAQBgNVBAsMCUF4aXMgQmFuazEhMB8GA1UEAwwYcmd3Lmp3ZWp3cy51YXQuYXhpc2IuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsnQpZr0a8kkIriT+rwwpAJ89IidiLfnII4/wW8gqgTXiijDkBCKuL1Unbw5Tu4c/KRPFc7exhelePG+jPZtSTo5Kqy2IlosP4MOi4LFLNV4l8102nipumJ0KUAjnkGsalY2omIuae2uq6PI4gHhezCS0Q742qIbKI52tPw9ZTxeF8csPLn1dZPooJeK/3gWA3JS1YTvqx1xANAKyy6eaXsrIBPZar/pypwNmfpbLk+smVxLem5gyG2Jmi56SOhQFXAVW1NBbgeIEPsYlbghIFrzBXwzS8Hwcl2YMDl0UJsSzquAOcFhuDh6ZKqki6tgFN+KCczeBCPDKsBVZtGdJVQIDAQABo4HiMIHfMAwGA1UdEwQFMAMBAf8wHQYDVR0OBBYEFFAH79oC8dZ3Csggp0RdAL0QsLQJMIGiBgNVHSMEgZowgZeAFFAH79oC8dZ3Csggp0RdAL0QsLQJoXWkczBxMQswCQYDVQQGEwJJTjELMAkGA1UECAwCTUgxDzANBgNVBAcMBk11bmJhaTENMAsGA1UECgwEQXhpczESMBAGA1UECwwJQXhpcyBCYW5rMSEwHwYDVQQDDBhyZ3cuandlandzLnVhdC5heGlzYi5jb22CCEZCS919o9rJMAsGA1UdDwQEAwICvDANBgkqhkiG9w0BAQsFAAOCAQEALxNfMn7gVCJQgNxJ2iwXnw41ZM8BZf/iwIKrMkeFZcnqnxSwTpGxKAaRy3ExkyGBVmJQuGIEIjCGJfqp2SUNcr1UsFuy5kljiePR2TtjTZa4WwQ7RYFP9tk6u+0r7aVLk/jzfDx+ZHYjNjvy6TpFkMJB0fASwboRHxlv0TDpO66E0cEpJpfrkI7MEZSf6DTam+qn4OFUiqspG2ooclf9l9hIg4QeRJegWhPJvcqSpAnasLyhHLpTfgZFetVDNwwCYqu4XEb2fyySOy/WgGcz7fOU4mO1HxQ84TURjWhCbEmiAVHGY3y5Mc1tKgEupSvUGSSO2SlL9EXngunkv4cLTw==';

		try {
			const pemcert = await getPemCert(base64Certificate);
			const result = crypto
				.publicEncrypt(
					{
						key: pemcert,
						padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
						oaepHash: 'sha1',
					},
					Buffer.from(aesKey)
				)
				.toString('base64');
			// Use the PEM certificate as needed
			console.log(result);
			return result;
		} catch (error) {
			console.error('Error:', error);
			return { props: {} };
		}
	};

	const encryptData = (data) => {
		const aesKey = generateRandomString(32);
		// Encrypt the data along with IV using AES Algorithm
		const payloadToBeEncrypted =
			Buffer.from(INIT_VECT).toString() + JSON.stringify(data);
		const encryptedPayload = aesEncryption(payloadToBeEncrypted, aesKey);
		// Encrypt the AES key using RSA algorithm
		const encryptedAESKey = rsaEncryption(aesKey);
		return { encryptedAESKey, encryptedPayload };
	};

	const decryptData = (encryptedData, aesKey) => {
		// const iv = Buffer.from(encryptedData, 'base64').slice(0, 16);
		// const data = Buffer.from(encryptedData, 'base64').slice(16);
		// const decipher = crypto.createDecipheriv(
		// 	AES_ALGORITHM,
		// 	Buffer.from(aesKey, 'base64'),
		// 	iv
		// );
		// let decryptedData = decipher.update(data, 'base64', 'utf8');
		// decryptedData += decipher.final('utf8');
		// return JSON.parse(decryptedData);
	};

	useEffect(() => {
		// Get the first ID from your data
		const firstId = '123'; // replace with your logic to get the first ID
		// router.push(`/${firstId}`);
		let encryptedData = encryptData([
			{
				data: '123',
			},
		]);
		const decryptedData = decryptData(
			encryptedData.encryptedPayload,
			encryptedData.encryptedAESKey
		);
		console.log(decryptedData, 'decryptedData');
	});

	return (
		<>
			<p>Node Running</p>
		</>
	);
}
