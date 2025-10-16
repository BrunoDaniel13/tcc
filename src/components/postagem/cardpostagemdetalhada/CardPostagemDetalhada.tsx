import { Link } from "react-router-dom";
import type Postagem from "../../../models/Postagem";

interface Props {
  postagem: Postagem;
}

function CardPostagemDetalhada({ postagem }: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-3">{postagem.titulo}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{postagem.texto}</p>

      <div className="flex flex-col text-sm text-gray-500 mb-2">
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

      <div className="text-right mt-3">
        <Link
          to={`/postagens/${postagem.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          Ler mais →
        </Link>
      </div>
    </div>
  );
}

export default CardPostagemDetalhada;
