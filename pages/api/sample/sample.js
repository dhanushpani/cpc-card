import axios from 'axios';

export async function LCMGetCardDetailsResponse() {
	const res = {
		LCMGetCardDetailsResponse: {
			SubHeader: {
				requestUUID: '21052021-card-details',
				serviceRequestId: 'AX.ICC.LCM.CARDDET',
				serviceRequestVersion: '1.0',
				channelId: 'TBD',
			},
			LCMGetCardDetailsResponseBody: {
				GetCardDetailsResponse: {
					cardNumber: '4400060100001157',
					nameOnCard: 'Please do not use',
					cardExpiryDate: '2031-01',
					cvv2: '359',
				},
			},
		},
	};
	return res.LCMGetCardDetailsResponse.LCMGetCardDetailsResponseBody
		.GetCardDetailsResponse;
}

export async function getDetailsById() {
	const url = `${process.env.API_API_GET_CARD_DETAILS}/card/number/full`;
	const headers = {
		'gokiwi-token':
			'eyJ0b2tlblR5cGUiOiJnb2tpd2ktdG9rZW4iLCJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJBamF5IiwibGFzdE5hbWUiOiJSYW53YSIsImNvdW50cnlDb2RlIjoiOTEiLCJtb2JpbGVOdW1iZXIiOiI4NDcwOTM1MzYzIiwiYXBwVG9rZW4iOiJmLXhZYndQMnczSElRbHd5UkQ4ZnZyYlluWDA3anFYSXl6RTlERFo1U0VacUt4U2MtS3BtcmV5bnVwanVfTGZQSzlRLXM2SUFnY1JJZS1ZSkNIQzFMd2hydVlDTW1QbHVwV3BYIiwib3NUeXBlIjoiQW5kcm9pZCIsImlzQWN0aXZlIjp0cnVlLCJleHAiOjE2ODE5Nzg5NjQsInVzZXJJZCI6IjQwNTA1NjFkLTFmODMtNDBkMS05NDExLTU3NjExNmIxMGM4OCIsImlhdCI6MTY4MTk3Mjk2NCwiZW1haWwiOm51bGx9.-yb75ZY_FbxgxKsgVcX6MDM07neaZEjkTSmRDchulAxx6X1r1PgIqb-NGeOAqrPEd4tUgbYpoOADNKfmLFCKrg',
		'Content-Type': 'application/json',
		Authorization:
			'Bearer AAIkMDIzYWM2YjEtNTQ2MS00ZTllLTllNzktNjQ1NzMwZWUyYzJm9YgsMXH7Zk0B_DrwLjCe_tt45hlooXQogb-maWBV-5WvqwIovBkbZSuCIV9aHDBoYFyBEK6ZUP-4tkS8lcYBXKt1FJDVdFbdoY8VqIVcV_ZWFkVw7-K9RAZHO-p64ZMe_HzMVDgor_WluywgYvCW4A',
	};
	const data = {
		cardSerNo: '81672',
		deviceId: 'asfqd',
		dateOfBirth: '22-05-90',
	};
	try {
		const response = await axios.post(url, data, { headers });
		console.log(response.data);
		return response.data;
		// Do something with the response data
	} catch (error) {
		console.error(error);
		// Handle any errors
	}
}
