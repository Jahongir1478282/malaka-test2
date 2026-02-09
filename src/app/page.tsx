import { TestApp } from "../components/TestApp";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-4 sm:p-8">
      <TestApp />
    </main>
  );
}
