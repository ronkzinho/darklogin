import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Page not found</h1>
      <Link href="/home">
        <p style={{ color: "gray", margin: 0, cursor: "pointer" }}>
          Go to home
        </p>
      </Link>
    </div>
  );
}
