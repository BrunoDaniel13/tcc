import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { buscarComentarios, cadastrarComentario, deletarComentario } from "../../services/Service";
import type Comentario from "../../models/Comentario";

interface ComentarioSectionProps {
  idPostagem: number;
}

function ComentarioSection({ idPostagem }: ComentarioSectionProps) {
  const { usuario } = useContext(AuthContext);
  const token = usuario?.token || "";
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState("");

  async function carregarComentarios() {
    try {
      const lista = await buscarComentarios(idPostagem);
      setComentarios(lista);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
  }

  async function enviarComentario(e: React.FormEvent) {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    try {
     await cadastrarComentario(idPostagem, novoComentario, {
  headers: { Authorization: `Bearer ${token}` },
    });
      setNovoComentario("");
      carregarComentarios();
    } catch (error: any) {
      console.error("Erro ao enviar comentário:", error);
      alert("Você precisa estar logado para comentar.");
    }
  }

  async function excluirComentario(id: number) {
    const confirmar = window.confirm("Deseja realmente excluir este comentário?");
    if (!confirmar) return;

    try {
      await deletarComentario(id, { headers: { Authorization: `Bearer ${token}` } });
      carregarComentarios();
    } catch {
      alert("Erro ao excluir comentário.");
    }
  }

  useEffect(() => {
    carregarComentarios();
  }, [idPostagem]);

  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">Comentários</h3>

      {/* Lista de comentários */}
      {comentarios.length > 0 ? (
        <ul className="space-y-3">
          {comentarios.map((comentario) => (
            <li key={comentario.id} className="bg-white p-3 rounded-md shadow-sm flex justify-between">
              <div>
                <p className="text-gray-800">{comentario.texto}</p>
                <span className="text-sm text-gray-500">
                  {comentario.usuario?.nome || "Anônimo"} -{" "}
                  {new Date(comentario.data).toLocaleString("pt-BR")}
                </span>
              </div>

              {/* Excluir se for o autor */}
              {comentario.usuario?.id === usuario?.id && (
                <button
                  onClick={() => excluirComentario(comentario.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm ml-3"
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum comentário ainda.</p>
      )}

      {/* Adicionar comentário */}
      <form onSubmit={enviarComentario} className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ComentarioSection;
