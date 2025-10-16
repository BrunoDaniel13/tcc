import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// ==================== USUÁRIO ====================

export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
  const resposta = await api.post(url, dados);
  setDados(resposta.data);
};

export const login = async (url: string, dados: Object, setDados: Function) => {
  const resposta = await api.post(url, dados);
  setDados(resposta.data);
};

// ==================== POSTAGENS ====================

export const buscar = async (url: string, setDados: Function, header: Object) => {
  const resposta = await api.get(url, header);
  setDados(resposta.data);
};

export const cadastrar = async (url: string, dados: Object, setDados: Function, header: Object) => {
  const resposta = await api.post(url, dados, header);
  setDados(resposta.data);
};

export const atualizar = async (url: string, dados: Object, setDados: Function, header: Object) => {
  const resposta = await api.put(url, dados, header);
  setDados(resposta.data);
};

export const deletar = async (url: string, header: Object) => {
  await api.delete(url, header);
};

// ==================== AVALIAÇÕES ====================

export const avaliarPostagem = async (idPostagem: number, nota: number, header: Object) => {
  const resposta = await api.post(`/avaliacoes/${idPostagem}`, { nota }, header);
  return resposta.data;
};

export const buscarMediaAvaliacao = async (idPostagem: number) => {
  const resposta = await api.get(`/avaliacoes/media/${idPostagem}`);
  return resposta.data;
};

export const buscarMinhaAvaliacao = async (idPostagem: number, header: Object) => {
  try {
    const resposta = await api.get(`/avaliacoes/minha/${idPostagem}`, header);
    return resposta.data;
  } catch {
    return null;
  }
};

// ==================== COMENTÁRIOS ====================

export const buscarComentarios = async (idPostagem: number) => {
  const resposta = await api.get(`/comentarios/postagem/${idPostagem}`);
  return resposta.data;
};

// ✅ Correção principal: endpoint agora é /comentarios, não /comentarios/{id}
export const cadastrarComentario = async (
  idPostagem: number,
  texto: string,
  header: Object
) => {
  const resposta = await api.post(`/comentarios/${idPostagem}`, { texto }, header);
  return resposta.data;
};

export const deletarComentario = async (idComentario: number, header: Object) => {
  await api.delete(`/comentarios/${idComentario}`, header);
};

export default api;
