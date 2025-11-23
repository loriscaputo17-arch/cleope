import { Suspense } from "react";
import ConfirmationPage from "../../components/confirmationthemerge";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationPage />
    </Suspense>
  );
}