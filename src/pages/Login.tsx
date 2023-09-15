import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState<string>("jack@example.com");
  const [password, setPassword] = useState<string>("qwerty");

  // Context
  const { login, isAuthenticated } = useAuth();
  // Navigate
  const navigate = useNavigate();

  useEffect(() => {
    // Control and navigate
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated]);

  function FormHandler(e) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <main className={styles.login}>
      <PageNav></PageNav>
      <form
        className={styles.form}
        onSubmit={(e) => {
          FormHandler(e);
        }}
      >
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
