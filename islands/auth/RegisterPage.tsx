import { useState, useEffect } from "preact/hooks";
import { invoke } from "site/runtime.ts";

export default function RegisterPage() {
  const [userData, setUserData] = useState({
    company: "",
    branch: "",
    email: "",
    password: "",
  });

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    localStorage.removeItem("userInfo");
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const submitHandler = async () => {
    setIsEmailValid(true);
    if (!isValidEmail(userData.email)) {
      setIsEmailValid(false);
      return;
    }
    try {
      const response = await invoke.site.actions.auth.actionRegister(
        { userProvided: userData },
      );

      console.log("Response:", response);

      if (response.error) {
        console.error(
          "Server reported an error:",
          response.error,
          "status:",
          response.status,
        );
        if (response.status === 403) {
          setAuthError(true);
        }
      } else if (response.status === 201) {
        console.log("Registration successful");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      if (error.status === 403) {
        setAuthError(true);
      }
    }
  };

  return (
    <div class="flex flex-col justify-center items-center gap-4 py-8 mx-auto h-screen bg-gray-100">
      <h1 class="text-2xl font-bold mb-1 text-center">Cadastro</h1>
      <label
        className={`input input-bordered flex items-center gap-2 ${
          (!isEmailValid || authError) ? "border-2 border-red-500" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="text"
          className={`grow `} // Adiciona borda vermelha se o email for inválido
          placeholder="Email"
          value={userData.email}
          onChange={(e: any) => {
            setUserData({ ...userData, email: e.target.value });
            setIsEmailValid(true); // Resetar a validade quando o usuário começa a digitar
          }}
        />
      </label>
      {!isEmailValid && (
        <p className="text-red-500 text-sm">
          Por favor, insira um email válido.
        </p>
      )}
      {authError && (
        <p className="text-red-500 text-sm">
          Email já em uso.
        </p>
      )}
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Empresa"
          value={userData.company}
          onChange={(e: any) =>
            setUserData({ ...userData, company: e.target.value })}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Filial"
          value={userData.branch}
          onChange={(e: any) =>
            setUserData({ ...userData, branch: e.target.value })}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          className="grow"
          placeholder="Senha"
          value={userData.password}
          onChange={(e: any) =>
            setUserData({ ...userData, password: e.target.value })}
        />
      </label>
      <button className="btn btn-success" onClick={submitHandler}>
        Cadastrar
      </button>
    </div>
  );
}
