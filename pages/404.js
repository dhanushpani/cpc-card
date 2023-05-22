import CustomError from './_error';

export default function NotFound() {
  return <CustomError statusCode={404} />;
}