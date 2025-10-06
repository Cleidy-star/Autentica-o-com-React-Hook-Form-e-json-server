import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

type FormLogin = {
  nomeUsuario: string;
  email: string;
};

const API_URL = import.meta.env.VITE_API_URL_BASE || "http://localhost:3001";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormLogin>({
    defaultValues: { nomeUsuario: "", email: "" },
  });

  const onSubmit = async (data: FormLogin) => {
    const res = await fetch(
      `${API_URL}/usuarios?nomeUsuario=${encodeURIComponent(
        data.nomeUsuario
      )}&email=${encodeURIComponent(data.email)}`
    );

    if (!res.ok) {
      alert("Falha na ligação ao servidor.");
      return;
    }

    const lista = await res.json();
    const user = lista[0];

    if (!user) {
      alert("Credenciais inválidas.");
      return;
    }

   
    localStorage.setItem("auth:user", JSON.stringify(user));
    sessionStorage.setItem("isAuth", "1");

    reset();
    navigate("/dashboard");
  };

  return (
    <div id="login-page">
      <form id="login-card" onSubmit={handleSubmit(onSubmit)} aria-labelledby="login-title">
        <h1 id="login-title">Login</h1>

        
        <div>
          <label htmlFor="nomeUsuario">Nome de utilizador</label>
          <input
            id="nomeUsuario"
            placeholder="ex: ana.silva"
            aria-invalid={!!errors.nomeUsuario || undefined}
            {...register("nomeUsuario", {
              required: "O nome de utilizador é obrigatório.",
              minLength: { value: 3, message: "Mínimo de 3 caracteres." },
              maxLength: { value: 20, message: "Máximo de 20 caracteres." },
              pattern: {
                value: /^[a-zA-Z0-9._-]+$/,
                message: "Use apenas letras, números, ponto, traço e underscore.",
              },
            })}
          />
          {errors.nomeUsuario && (
            <p data-error>{errors.nomeUsuario.message}</p>
          )}
        </div>

       
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            aria-invalid={!!errors.email || undefined}
            {...register("email", {
              required: "O email é obrigatório.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Formato de email inválido." },
            })}
          />
          {errors.email && (
            <p data-error>{errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "A entrar..." : "Entrar"}
        </button>

        <p>
          Você ainda não tem uma conta?{" "}
          <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}
