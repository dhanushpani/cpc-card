// pages/500.js
import CustomError from './_error';

export default function ServerError() {
  return <CustomError statusCode={500} />;
}