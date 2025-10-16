import { useEffect, useState, useContext } from "react";
import ModalPostagem from "../../components/postagem/modalpostagem/ModalPostagem";
import CardPostagem from "../../components/postagem/cardpostagem/CardPostagem";
import { buscar } from "../../services/Service";
import type Tema from "../../models/Temas";
import type Postagem from "../../models/Postagem";
import { AuthContext } from "../../contexts/AuthContext";

function Home() {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [postagens, setPostagens] = useState<Postagem[]>([]);
  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario?.token || "";

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca temas — se logado, usa token; senão, busca pública
        if (token) {
          await buscar("/temas", setTemas, {
            headers: { Authorization: token },
          });
        } else {
          await buscar("/temas", setTemas, {});
        }

        // Busca postagens — se logado, usa token; senão, busca pública
        if (token) {
          await buscar("/postagens", setPostagens, {
            headers: { Authorization: token },
          });
        } else {
          await buscar("/postagens", setPostagens, {});
        }
      } catch (error: any) {
        if (error.toString().includes("401") && token) {
          handleLogout();
        } else {
          console.error("Erro ao carregar dados:", error);
        }
      }
    }

    carregarDados();
  }, [token]);

  // Agrupa postagens por tema
  const postagensPorTema: { [key: string]: Postagem[] } = {};
  postagens.forEach((post) => {
    const temaId = post.temas?.id?.toString() ?? "sem-tema";
    if (!postagensPorTema[temaId]) postagensPorTema[temaId] = [];
    postagensPorTema[temaId].push(post);
  });

  return (
    <div className="bg-black min-h-screen flex flex-col items-center">
      {/* topo */}
      <div className="w-full flex flex-col items-center pt-12 pb-8">
        <div className="flex items-center mb-8 justify-center w-full max-w-lg">
          <span className="text-red-600 text-5xl font-extrabold mr-2">+</span>
          <span className="text-blue-800 text-5xl font-extrabold tracking-wide">
            AULA
          </span>
        </div>
        <p className="text-xl text-white mb-6 text-center">
          Deixe aqui suas recomendações e opiniões!
        </p>
        <div className="flex justify-center w-full mb-8">
          <ModalPostagem className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200 transition-colors" />
        </div>
      </div>

      {/* temas e postagens */}
      <div className="w-full max-w-5xl px-4">
        {temas.map((tema) => (
          <div key={tema.id} className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-4">
              {tema.descricao}
            </h3>
            <div
              className="flex flex-nowrap gap-4 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#1e40af #222" }}
            >
              {postagensPorTema[tema.id]?.length ? (
                postagensPorTema[tema.id].map((postagem) => (
                  <CardPostagem key={postagem.id} postagem={postagem} />
                ))
              ) : (
                <span className="text-gray-400">
                  Nenhuma postagem para este tema.
                </span>
              )}
            </div>
          </div>
        ))}

        {/* sem tema */}
        {postagensPorTema["sem-tema"] && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-4">Sem tema</h3>
            <div
              className="flex flex-nowrap gap-4 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#1e40af #222" }}
            >
              {postagensPorTema["sem-tema"].map((postagem) => (
                <CardPostagem key={postagem.id} postagem={postagem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
