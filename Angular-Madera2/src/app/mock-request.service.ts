import { Injectable } from '@angular/core';
// import { CategorieFormTypeEnum } from './business/materiel/component/categorie-form.model';
// import { CategorieEntity } from './core/entity/materiel/categorie.entity';
// import { MaterielEntity } from './core/entity/materiel/materiel.entity';
import { MockRequest } from './lib/mock-request/mock-request';

/**
 * Classe permettant de simuler des accès à la Web API
 */
@Injectable()
export class MockRequestService extends MockRequest {
  /**
   * Créé la source de données pour le jeu de test
   */

  public createDB(): { [table: string]: any[] } {
    // const categories: CategorieEntity[] = [
    //     {
    //         couleur: '#111',
    //         id: 0,
    //         nom: 'meuble',
    //     },
    //     {
    //         couleur: '#333',
    //         id: 1,
    //         nom: 'high-tech',
    //     },
    // ];

    // const materiels: MaterielEntity[] = [
    //     {
    //         id: 0,
    //         couleur: 'blue',
    //         lieuFormation: 'Salle 02',
    //         nom: 'Cable HDMI',
    //         reference: '#cable',
    //         isArchive: false,
    //         categorie: categories[0],
    //     },
    //     {
    //         id: 1,
    //         couleur: 'red',
    //         lieuFormation: 'Salle 11',
    //         nom: 'Retro projecteur',
    //         reference: '#retro',
    //         isArchive: true,
    //         categorie: categories[1],
    //     },
    //     {
    //         id: 2,
    //         couleur: 'yellow',
    //         lieuFormation: 'Salle 13',
    //         nom: 'Table et Chaise',
    //         reference: '#meuble',
    //         isArchive: false,
    //         categorie: categories[0],
    //     },
    // ];

    return {
      // materiel: materiels,
      // categorie: categories,
    };
  }

  /**
   * Créé les points d'entrés dont la réponse sera simulée
   */
  public createEndPoints(): { [endPoint: string]: Function } {
    return {
      // End-Point Materiel
      // 'get /api/materiel': () => {
      //     return this.getAll('materiel');
      // },
      // 'get /api/materiel/{id}': (id) => {
      //     return this.get('materiel', id);
      // },
      // 'post /api/materiel': (data) => {
      //     const id = this.add('materiel', data);
      //     return this.get('materiel', id);
      // },
      // 'put /api/materiel/{id}': (id, data) => {
      //     this.update('materiel', id, data);
      //     return this.get('materiel', id);
      // },
      // 'delete /api/materiel/{id}': (id) => {
      //     this.delete('materiel', id);
      // },
      // End-Point Categorie de Materiels
      // 'get /api/categorie': () => {
      //     return this.getAll('categorie');
      // },
      // 'get /api/categorie/{id}': (id) => {
      //     return this.get('categorie', id);
      // },
      // 'post /api/categorie': (data) => {
      //     const id = this.add('categorie', data);
      //     return this.get('categorie', id);
      // },
      // 'put /api/categorie/{id}': (id, data) => {
      //     this.update('categorie', id, data);
      //     return this.get('categorie', id);
      // },
      // 'delete /api/categorie/{id}': (id) => {
      //     this.delete('categorie', id);
      // },
    };
  }
}
