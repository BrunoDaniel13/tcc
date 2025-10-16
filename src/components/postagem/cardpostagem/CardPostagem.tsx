import { Link } from "react-router-dom";
import type Postagem from "../../../models/Postagem";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscarMediaAvaliacao } from "../../../services/Service";

interface Props {
  postagem: Postagem;
}

function CardPostagem({ postagem }: Props) {
  const [media, setMedia] = useState<number>(0);
  const { usuario } = useContext(AuthContext);
  const token = usuario?.token || "";

  async function carregarMedia() {
    try {
      const mediaResposta = await buscarMediaAvaliacao(postagem.id);
      setMedia(Number(mediaResposta) || 0);
    } catch (error) {
      console.error("Erro ao carregar média:", error);
      setMedia(0);
    }
  }

  useEffect(() => {
    carregarMedia();
  }, [postagem.id]);

  const textoLimite = 80;
  const textoExibido =
    postagem.texto.length > textoLimite
      ? postagem.texto.substring(0, textoLimite) + "..."
      : postagem.texto;

  const estrelasPreenchidas = Math.round(media);

  return (
    <Link to={`/postagens/${postagem.id}`} state={{ atualizaMedia: true }}>
      <div className="bg-gray-900 p-3 rounded-lg shadow hover:scale-105 transition-transform cursor-pointer w-[180px] h-[260px] flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">
            {postagem.titulo}
          </h3>
          <p className="text-gray-400 text-xs mb-2">
            Tema: {postagem.temas?.descricao ?? "Sem tema"}
          </p>
          <p className="text-gray-300 mb-4 text-xs">{textoExibido}</p>
        </div>

        {/* Estrelas com média */}
        <div className="flex justify-center items-center mt-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < estrelasPreenchidas ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <div className="text-center text-xs text-gray-400 mb-2">
          Média: {media.toFixed(1)}
        </div>

        {/* Exibe os botões apenas se o usuário estiver logado */}
        {token && (
          <div className="flex justify-center gap-4 mt-1">
            <Link to={`/editarpostagem/${postagem.id}`}>
              <FaEdit
                className="text-blue-500 hover:text-blue-700 cursor-pointer text-lg"
                title="Editar"
              />
            </Link>
            <Link to={`/deletarpostagem/${postagem.id}`}>
              <FaTrash
                className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                title="Deletar"
              />
            </Link>
          </div>
        )}
      </div>
    </Link>
  );
}

export default CardPostagem;
