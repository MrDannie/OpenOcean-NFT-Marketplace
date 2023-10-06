import type { NextPage } from "next";
import CreationPage from "../modules/CreationPage";
import { ErrorBoundary } from "react-error-boundary";

const Create: NextPage = () => {
  return (
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
       <CreationPage />
  </ErrorBoundary>
  );
};

export default Create;
