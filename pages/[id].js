/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { LCMGetCardDetailsResponse } from "./api/sample/sample";
import styles from "./Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import crypto from "crypto";
import { base64ToPem } from "@/lib/pem";

const CHARACTERS_FOR_SECRET = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()`;
const RSA_PUBLIC_KEY_CERT =
  process.env.NEXT_PUBLIC_RSA_KEY?.replace(/\\n/g, "\n") || "";
const AES_ALGORITHM = "aes-256-cbc";
const INIT_VECT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
      console.log("something   went wrong");
    }
  }
}
function formatDate(s) {
  return s.toString().replace(/\d{4}(?=.)/g, "$& ");
}

// From here started Doing

const generateRandomString = (keyLength) => {
  // Generate a radom character string of specified length
  let generatedString = "";
  for (let i = 0; i < keyLength; i++) {
    const randomNum = Math.floor(Math.random() * CHARACTERS_FOR_SECRET.length);
    generatedString += CHARACTERS_FOR_SECRET.substring(
      randomNum,
      randomNum + 1
    );
  }
  return generatedString;
};

//********** AES encryption ************//
const aesEncryption = (payload, aesKey) => {
  const cipherdata = crypto.createCipheriv(
    AES_ALGORITHM,
    Buffer.from(aesKey),
    Buffer.from(INIT_VECT)
  );
  let encyptedPayload = cipherdata.update(payload, "utf8", "base64");
  encyptedPayload += cipherdata.final("base64");
  return encyptedPayload;
};
//****** End of AES encryption *********//
const getPemCert = async (base64Certificate) => {
	try {
		const pemCert = await base64ToPem(base64Certificate);
		return pemCert;
	} catch (error) {
		console.log(error, 'error');
	}
};
//****** RSA Encryption ******//
const rsaEncryption = async (aesKey, certificate) => {
//   const certif = `-----BEGIN PUBLIC KEY-----\n${certificate}\n-----END PUBLIC KEY-----`?.replace(/\\n/g, "\n")
//   const key =  certif || RSA_PUBLIC_KEY_CERT
		certificate = await getPemCert(certificate)
		console.log('---ccc',certificate)
   return crypto.publicEncrypt(
      {
        key: certificate,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha1",
      },
      Buffer.from(aesKey)
    )
    .toString("base64");
};

const encryptData = async(data, certificate) => {
  const aesKey = generateRandomString(32);
  // Encrypt the data along with IV using AES Algorithm
  const payloadToBeEncrypted =
    Buffer.from(INIT_VECT).toString() + JSON.stringify(data);
  const encryptedPayload = await aesEncryption(payloadToBeEncrypted, aesKey);

  // Encrypt the AES key using RSA algorithm
  const encryptedAESKey = await rsaEncryption(aesKey, certificate);

  return { encryptedAESKey, encryptedPayload , aesKey};
};

//********** AES Decryption ************//
export const decryptData = (encryptedData , aesKey) => {
    const iv = Buffer.from(encryptedData, 'base64').slice(0,16);
    const data = Buffer.from(encryptedData, 'base64').slice(16);
    const decipher = crypto.createDecipheriv(
                                AES_ALGORITHM,
                                Buffer.from(aesKey, 'base64'),
                                iv
                            );
    let decryptedData = decipher.update(data);
    decryptedData+= decipher.final('utf8');
    return JSON.parse(decryptedData);
}

const api = {
  certificate_api: "https://api-preprod.gokiwi.in/acs/card/certificate",
  generate_opt: "https://api-preprod.gokiwi.in/acs/card/generate/auth",
};

const STATUS = [200];

const getCertificate = async () => {
  try {
    const response = await axios.get(api.certificate_api);
    const { data, status } = response;
    if (STATUS?.includes(status)) {
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

const getOTPValue = async (key, payload)=>{
	try{
		const response = await axios.post(api.generate_opt,
			{ Data: payload, Risk: "" }, 
			{
				headers: {
					'Content-Type': 'application/json',
					'x-fapi-uuid': 'Somethingbdaassfasfadafqa1',
					'enckey': key 
		     	}
		    } 
		   )
		console.log(response,"response")
	}
	catch(err){
		console.log(err)
	}
}

export default function Page(props) {
  const [seconds, setSeconds] = useState(process.env.REDIRECT_TIME);
  const [widthSize, setWidthSize] = useState(0);

  const router = useRouter();
  const { id } = router.query;

  const effectCallback = async () => {
    if (id) {
      const certificate = await getCertificate();
      const publicCertificate = certificate?.data?.publicCert;

      const data = {
        LCMGenerateAuthOTPRequest: {
          SubHeader: {
            requestUUID: "e70bf5a0-416b-4ed5-9e0d-0c3c4b88151",
            serviceRequestId: "AX.ICC.LCM.AUTH.GEN",
            serviceRequestVersion: "1.0",
            channelId: "GOKIWI",
          },
          LCMGenerateAuthOTPRequestBody: {
            cardSerNo: "81672",
            deviceId: "asfqd",
            otpReferenceId: "64231721123131",
          },
        },
      };
      const encrypt = await encryptData(data, publicCertificate);
	  const { encryptedAESKey, encryptedPayload ,aesKey } = encrypt 
	  console.log('---encryptedAESKey',encryptedAESKey)
	  console.log('---encryptedPayload',encryptedPayload)
	  const decrypt = await decryptData(encryptedPayload, aesKey )
	  console.log(decrypt,"decrypt")
	//   const optResult  = await getOTPValue(encryptedAESKey, encryptedPayload)
    }
  };

  useEffect(effectCallback, [id]);

  console.log(id, "DATA");

  useEffect(() => {
    setWidthSize(window.innerWidth);
  });

  // useEffect(() => {
  // 	if (seconds > 0) {
  // 		const intervalId = setInterval(() => {
  // 			setSeconds(seconds - 1);
  // 		}, 1000);
  // 		return () => clearInterval(intervalId);
  // 	}
  // 	if (seconds === 0) {
  // 		window.location.href = 'https://www.google.com/';
  // 	}
  // }, [seconds]);

  const convertDate = (date) => {
    let dateStr = date;
    let parts = dateStr.split("-");
    let month = parts[1];
    let year = parts[0].substring(2);
    let convertedDateStr = month + "/" + year;
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
                src="/cardNew.png"
                alt="card"
                className={styles.card_image}
                width={100}
                height={100}
              />
              <div className={styles.time_container}>
                <span style={{ fontSize: "15px", marginRight: "12px" }}>
                  🔒
                </span>
                <p>
                  Due to security reasons, your Credit Card details will be
                  shown only for{" "}
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
