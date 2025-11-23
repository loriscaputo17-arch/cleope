import { Suspense } from "react";
import CheckinPage from "../../components/checkinthemerge";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckinPage />
    </Suspense>
  );
}