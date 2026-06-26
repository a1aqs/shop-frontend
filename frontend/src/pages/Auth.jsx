import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Auth() {
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Ошибка при отправке данных");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>{mode === "login" ? "Вход в аккаунт" : "Регистрация"}</h1>
        <div className="auth-switch">
          <button type="button" onClick={() => setMode("login")} className={mode === "login" ? "active" : ""}>
            Вход в аккаунт
          </button>
          <button type="button" onClick={() => setMode("register")} className={mode === "register" ? "active" : ""}>
            Регистрация
          </button>
        </div>

        {mode === "register" && (
          <label>
            Имя
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
        </label>
        <label>
          Пароль
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Отправка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}
