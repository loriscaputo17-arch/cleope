import { Suspense } from "react";
import BookPage from "../../components/bookthemerge";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookPage />
    </Suspense>
  );
}
