/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { LCMGetCardDetailsResponse } from './api/sample/sample';
import styles from './Home.module.css';

// cryptoJS for encryption and decryption
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

export async function getServerSideProps({ params }) {
	// Fetch the data for the ID
	const data = {};
	try {
		// const res = await getDetailsById();
		const res = await LCMGetCardDetailsResponse();
		return {
			props: {
				data: res,
			},
		};
	} catch (error) {
		if (error) {
			console.log('something   went wrong');
		}
	}
}

function formatDate(s) {
	return s.toString().replace(/\d{4}(?=.)/g, '$& ');
}

export default function Page(props) {
	const [seconds, setSeconds] = useState(process.env.REDIRECT_TIME);
	const [widthSize, setWidthSize] = useState(0);

	useEffect(() => {
		setWidthSize(window.innerWidth);
	});

	// AES Sample Test
	useEffect(() => {
		const decryptId = (str) => {
			const decodedStr = decodeURIComponent(str);
			return AES.decrypt(decodedStr, 'secretPassphrase').toString(enc.Utf8);
		};

		// encryption sample
		const ciphertext = AES.encrypt('hello', 'secretPassphrase');
		const encryptNewId = encodeURIComponent(ciphertext.toString());
		console.log(encodeURIComponent(ciphertext.toString()), 'cipherText');

		// decryption sample
		const decryptedText = decryptId(encryptNewId);
		console.log(decryptedText, 'text');
	}, []);

	useEffect(() => {
		if (seconds > 0) {
			const intervalId = setInterval(() => {
				setSeconds(seconds - 1);
			}, 1000);
			return () => clearInterval(intervalId);
		}
		if (seconds === 0) {
			window.location.href = 'https://google.com';
		}
	}, [seconds]);

	const convertDate = (date) => {
		let dateStr = date;
		let parts = dateStr.split('-');
		let month = parts[1];
		let year = parts[0].substring(2);
		let convertedDateStr = month + '/' + year;
		return convertedDateStr;
	};
	const { data } = props;

	if (widthSize > 500) return <div>Please Open in mobile View</div>;
	return (
		<>
			{!data ? (
				<p>Loading</p>
			) : (
				<div className={styles.main_container}>
					<div className={styles.main}>
						<div className={styles.card}>
							<div className={styles.input_section}>
								<p className={styles.input_number}>
									{formatDate(data.cardNumber)}
								</p>
								<p className={styles.input_validity}>
									VALID THRU {convertDate(data.cardExpiryDate)}
								</p>
								<p className={styles.cardName}>{data.nameOnCard}</p>
							</div>
							<img
								src='/cardNew.png'
								alt='card'
								className={styles.card_image}
								width={100}
								height={100}
							/>
							<div className={styles.time_container}>
								<span style={{ fontSize: '15px' }}>🔒</span>
								<p>
									Due to security reasons, your Credit Card details will be
									shown only for{' '}
									<span className={styles.seconds}>{seconds}</span> seconds. You
									will be redirected to App home page after that.
								</p>
							</div>
							<div className={styles.cvv_container}>
								<div className={styles.cvv_label}>CVV</div>
								<div className={styles.cvv_value}>{data.cvv2}</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
