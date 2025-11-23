import { Suspense } from "react";
import CheckinPage from "../../components/check";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckinPage />
    </Suspense>
  );
}