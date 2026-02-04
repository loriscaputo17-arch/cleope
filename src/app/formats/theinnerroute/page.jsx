import { Suspense } from "react";
import BookPage from "../../components/boottheinnerroute1";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookPage />
    </Suspense>
  );
}