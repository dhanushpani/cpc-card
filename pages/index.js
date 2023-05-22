import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function Home() {
	const router = useRouter();

	useEffect(() => {
		// Get the first ID from your data
		const firstId = '123'; // replace with your logic to get the first ID
		router.push(`/${firstId}`);
	});

	return <></>;
}
