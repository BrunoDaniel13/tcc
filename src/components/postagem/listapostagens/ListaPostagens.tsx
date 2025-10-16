import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar } from "../../../services/Service";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type Postagem from "../../../models/Postagem";

function ListaPostagens() {
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario?.token || "";
  const navigate = useNavigate();
  const location = useLocation();

  async function buscarPostagens() {
    try {
      if (token) {
        await buscar("/postagens", setPostagens, {
          headers: { Authorization: token },
        });
      } else {
        await buscar("/postagens", setPostagens, {}); // rota pública
      }
    } catch (error: any) {
      if (error.toString().includes("401") && token) {
        handleLogout();
      } else {
        console.error("Erro ao carregar postagens:", error);
      }
    }
  }

  useEffect(() => {
    buscarPostagens();
  }, [token]);

  useEffect(() => {
    if (location.state?.atualizaMedia) {
      buscarPostagens();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  if (postagens.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-10">Nenhuma postagem encontrada.</p>
    );
  }

  return (
    <div className="container mx-auto my-8 flex flex-col gap-6">
      {postagens
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .map((postagem) => (
          <div
            key={postagem.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">
              {postagem.titulo}
            </h2>

            <p className="text-gray-700 mb-4 line-clamp-4">{postagem.texto}</p>

            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 mb-3">
              <span>
                <strong>Autor:</strong> {postagem.usuario?.nome || "Anônimo"}
              </span>
              <span>
                <strong>Tema:</strong> {postagem.temas?.descricao || "Sem tema"}
              </span>
              <span>
                <strong>Data:</strong>{" "}
                {new Date(postagem.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="text-right">
              <Link
                to={`/postagens/${postagem.id}`}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Ler mais →
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ListaPostagens;
