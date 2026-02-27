import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { signup } from "../lib/api";

export default function Signup() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await signup({ full_name: fullName, email, password });
      localStorage.setItem("skillgap_token", r.access_token);
      nav("/");
    } catch (e2) {
      setErr(e2.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <div className="text-xl font-semibold">Create account</div>
        <div className="text-sm text-muted mt-1">Start tracking your analyses.</div>

        {err ? (
          <div className="mt-4 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-3 text-sm">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name (optional)" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" />

          <Button className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <div className="text-sm text-muted mt-4">
          Already have an account? <Link className="text-teal hover:underline" to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}