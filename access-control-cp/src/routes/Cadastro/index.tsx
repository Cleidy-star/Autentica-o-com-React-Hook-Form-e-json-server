import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

type FormData = {
  nome: string;
  nomeUsuario: string;
  email: string;
};

const API_URL = import.meta.env.VITE_API_URL_BASE || "http://localhost:3001";

export default function Cadastro() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormData>({
    defaultValues: { nome: "", nomeUsuario: "", email: "" },
  });

  async function checkDuplicates(nomeUsuario: string, email: string) {
    const [byUserRes, byEmailRes] = await Promise.all([
      fetch(`${API_URL}/usuarios?nomeUsuario=${encodeURIComponent(nomeUsuario)}`),
      fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`),
    ]);
    const [byUser, byEmail] = await Promise.all([byUserRes.json(), byEmailRes.json()]);
    return { userTaken: byUser.length > 0, emailTaken: byEmail.length > 0 };
  }

  async function onSubmit(data: FormData) {
    setServerError(null);

   
    const { userTaken, emailTaken } = await checkDuplicates(data.nomeUsuario, data.email);
    if (userTaken) setError("nomeUsuario", { type: "manual", message: "Este nome de utilizador já existe." });
    if (emailTaken) setError("email", { type: "manual", message: "Este email já está registado." });
    if (userTaken || emailTaken) return;

   
    const r = await fetch(`${API_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: data.nome.trim(),
        nomeUsuario: data.nomeUsuario.trim(),
        email: data.email.trim(),
      }),
    });

    if (!r.ok) {
      setServerError("Não foi possível criar o utilizador. Tenta novamente.");
      return;
    }

    reset();
    
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white border rounded-2xl p-6 shadow space-y-5"
      >
        <h1 className="text-2xl font-bold">Criar conta</h1>

        {serverError && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

      
        <div>
          <label htmlFor="nome" className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            id="nome"
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.nome ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nome completo"
            {...register("nome", {
              required: "O nome é obrigatório.",
              minLength: { value: 3, message: "Mínimo de 3 caracteres." },
            })}
          />
          {errors.nome && <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>}
        </div>

       
        <div>
          <label htmlFor="nomeUsuario" className="block text-sm font-medium mb-1">
            Nome de utilizador
          </label>
          <input
            id="nomeUsuario"
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.nomeUsuario ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="ex: ana.silva"
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
            <p className="text-sm text-red-600 mt-1">{errors.nomeUsuario.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full border rounded-lg p-2 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="email@exemplo.com"
            {...register("email", {
              required: "O email é obrigatório.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Formato de email inválido." },
            })}
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
        >
          {isSubmitting ? "A criar..." : "Cadastrar"}
        </button>

        <p className="text-sm text-gray-600">
          Já tens conta?{" "}
          <Link to="/login" className="text-blue-700 underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}
