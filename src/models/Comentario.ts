import type Usuario from "./Usuario";
import type Postagem from "./Postagem";

export default interface Comentario {
  id: number;
  texto: string;
  data: string;
  usuario?: Usuario;
  postagem?: Postagem;
}
