export default function NotFound() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Page not found</h1>
      <a
        style={{ color: "gray", textDecoration: "none", cursor: "pointer" }}
        href="/home"
      >
        Go to home
      </a>
    </div>
  );
}
