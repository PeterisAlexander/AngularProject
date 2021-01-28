//import { MotCleRequest } from '../commun/mot-cle-request';

export interface MatiereRequest {
  couleur: string;
  id: number;
  isArchive: boolean;
  isPresentiel: boolean;
  //motsCles: MotCleRequest[];
  nom: string;
  reference: string;
}
