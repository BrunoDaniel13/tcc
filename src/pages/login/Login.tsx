import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../contexts/AuthContext";
import type UsuarioLogin from "../../models/UsuarioLogin";

function Login() {
  const navigate = useNavigate();
  const { usuario, handleLogin, isLoading } = useContext(AuthContext);

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>({} as UsuarioLogin);

  useEffect(() => {
    if (usuario.token !== "") {
      navigate('/home');
    }
  }, [usuario, navigate]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    });
  }

  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin(usuarioLogin);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen font-bold bg-black">
      {/* Formulário à esquerda */}
      <div className="flex flex-col items-start justify-center min-h-screen pl-8 w-full">
        <div className="flex items-center mb-8 justify-start w-full max-w-xs self-start ml-0">
          <span className="text-red-600 text-5xl font-extrabold mr-2">+</span>
          <span className="text-blue-800 text-5xl font-extrabold tracking-wide">AULA</span>
        </div>

        <form
          className="flex flex-col w-full max-w-xs gap-4 self-start"
          onSubmit={login}
        >
          <input
            type="text"
            id="usuario"
            name="usuario"
            placeholder="Usuário"
            className="bg-black border-2 border-gray-300 rounded-lg p-3 text-white placeholder-gray-300 focus:outline-none"
            value={usuarioLogin.usuario}
            onChange={atualizarEstado}
          />

          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Senha"
            className="bg-black border-2 border-gray-300 rounded-lg p-3 text-white placeholder-gray-300 focus:outline-none"
            value={usuarioLogin.senha}
            onChange={atualizarEstado}
          />

          <button
            type="submit"
            className="bg-blue-800 text-white rounded-lg py-3 px-6 font-bold hover:bg-blue-900 transition-colors w-full mt-2 flex justify-center cursor-pointer"
          >
            {isLoading ? (
              <ClipLoader color="#ffffff" size={24} />
            ) : (
              <span>Entrar</span>
            )}
          </button>

          <hr className="border-t border-white my-4" />
          <p className="text-white text-center text-sm">
            Ainda não tem uma conta?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/cadastro")}
            >
              Cadastre-se
            </span>
          </p>
        </form>
      </div>
      {/* Imagem à direita */}
      <div
        className="bg-[url('https://i.imgur.com/ZZFAmzo.jpg')] lg:block hidden bg-no-repeat 
        w-full min-h-screen bg-cover bg-center"
      ></div>
    </div>
  );
}

export default Login;