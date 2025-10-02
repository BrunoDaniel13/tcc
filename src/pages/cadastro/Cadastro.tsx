import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import type Usuario from "../../models/Usuario";
import { cadastrarUsuario } from "../../services/Service";

function Cadastro() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  // Removido o id, o backend vai gerar
  const [usuario, setUsuario] = useState<Omit<Usuario, 'id'>>({
    nome: '',
    usuario: '',
    senha: ''
  });

  function retornar() {
    navigate('/');
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(e.target.value);
  }

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (confirmarSenha === usuario.senha && usuario.senha.length >= 8) {
      setIsLoading(true);

      try {
        // Envia apenas os campos necessários
        await cadastrarUsuario('/usuarios/cadastrar', usuario, setUsuario);
        alert('Usuário cadastrado com sucesso!');
        retornar();
      } catch (error) {
        alert('Erro ao cadastrar o usuário!');
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Dados do usuário inconsistentes! Verifique as informações do cadastro.');
      setUsuario({ ...usuario, senha: '' });
      setConfirmarSenha('');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen font-bold bg-black">
      {/* Imagem */}
      <div
        className="bg-[url('https://i.imgur.com/ZZFAmzo.jpg')] lg:block hidden bg-no-repeat 
        w-full min-h-screen bg-cover bg-center"
      ></div>

      {/* Formulário centralizado no espaço preto */}
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center w-full max-w-xs">
          {/* Logo centralizado em relação ao formulário */}
          <div className="flex items-center mb-8 justify-center w-full">
            <span className="text-red-600 text-5xl font-extrabold mr-2">+</span>
            <span className="text-blue-800 text-5xl font-extrabold tracking-wide">AULA</span>
          </div>

          <form
            className="flex flex-col w-full gap-4"
            onSubmit={cadastrarNovoUsuario}
          >
            <div className="flex flex-col w-full">
              <label htmlFor="nome" className="text-white mb-1 text-right"></label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Nome"
                className="bg-black border-2 border-gray-300 rounded-lg p-3 text-white placeholder-gray-300 focus:outline-none"
                value={usuario.nome}
                onChange={atualizarEstado}
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="usuario" className="text-white mb-1 text-right"></label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Usuário"
                className="bg-black border-2 border-gray-300 rounded-lg p-3 text-white placeholder-gray-300 focus:outline-none"
                value={usuario.usuario}
                onChange={atualizarEstado}
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="senha" className="text-white mb-1 text-right"></label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="Senha"
                className="bg-black border-2 border-gray-300 rounded-lg p-3 text-white placeholder-gray-300 focus:outline-none"
                value={usuario.senha}
                onChange={atualizarEstado}
              />
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="confirmarSenha" className="text-white mb-1 text-right"></label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                placeholder="Confirmar Senha"
                className="bg-black border-2 border-gray-300 rounded-lg p-3 text-white placeholder-gray-300 focus:outline-none"
                value={confirmarSenha}
                onChange={handleConfirmarSenha}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-800 text-white rounded-lg py-3 px-6 font-bold hover:bg-blue-900 transition-colors w-full mt-2 flex justify-center"
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={24} />
              ) : (
                <span>Cadastrar</span>
              )}
            </button>

            <hr className="border-t border-white my-4" />
            <p className="text-white text-center text-sm">
              Já tem uma conta?{" "}
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={retornar}
              >
                Entrar
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;