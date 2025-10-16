import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Postagem from "../../../models/Postagem";
import {
  buscar,
  avaliarPostagem,
  buscarMinhaAvaliacao,
} from "../../../services/Service";
import ComentarioSection from "../../../components/comentario/ComentarioSection";

function PostagemDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [postagem, setPostagem] = useState<Postagem | null>(null);
  const [minhaNota, setMinhaNota] = useState<number>(0);
  const { usuario, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = usuario.token;

  async function buscarPostagem() {
    try {
      await buscar(`/postagens/${id}`, setPostagem, {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      if (error.toString().includes("401")) {
        handleLogout();
      } else {
        console.error("Erro ao carregar postagem:", error);
      }
    }
  }

  async function carregarMinhaAvaliacao() {
    if (!id) return;
    try {
      const avaliacao = await buscarMinhaAvaliacao(Number(id), {
        headers: { Authorization: token },
      });
      if (avaliacao) setMinhaNota(avaliacao.nota);
    } catch {
      setMinhaNota(0);
    }
  }

  async function avaliar(nota: number) {
    if (!id) return;
    const confirmar = window.confirm(`Confirmar avaliação de ${nota} estrela(s)?`);
    if (!confirmar) return;

    try {
      await avaliarPostagem(Number(id), nota, {
        headers: { Authorization: token },
      });
      alert("Avaliação registrada com sucesso!");
      setMinhaNota(nota);
    } catch {
      alert("Erro ao enviar avaliação.");
    }
  }

  useEffect(() => {
    if (token === "") {
      alert("Você precisa estar logado");
      navigate("/");
      return;
    }

    if (id !== undefined) {
      buscarPostagem();
      carregarMinhaAvaliacao();
    }
  }, [id, token]);

  if (!postagem) {
    return <p className="text-center mt-8">Carregando postagem...</p>;
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">{postagem.titulo}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-line">{postagem.texto}</p>

      <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4">
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

      {/* Avaliação do usuário */}
      <div className="flex justify-center items-center mt-6">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            onClick={() => avaliar(i + 1)}
            className={`cursor-pointer text-3xl ${
              i < minhaNota ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Sua avaliação: {minhaNota > 0 ? `${minhaNota} estrela(s)` : "Nenhuma ainda"}
      </p>

      {/* Seção de comentários */}
      <ComentarioSection idPostagem={Number(id)} />
    </div>
  );
}

export default PostagemDetalhe;
