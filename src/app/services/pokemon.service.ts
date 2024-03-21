import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';;

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// 5. NOTA: Se tuvo que añadir esta interface porque el map no reconoce 'results', entonces
// se declaró como tipo any
// Definir una interfaz para el formato de los datos de respuesta de la API
interface PokemonApiResponse {
  results: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  // 2. Añadir API de pokeapi
  baseUrl = 'https://pokeapi.co/api/v2';
  imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  constructor(private http: HttpClient) { } // 1. Inyectar http

  // 3. Obtener lista de pokemons - Iniciar en el pokemon número 0
  getPokemon(offset = 0) {

    // 4. Retornar el baseUrl (lista de pokemones) y limitarla a 25 elementos
    // Se añade map para obtener una mejor estructura del arreglo de la lista
    return this.http.get<PokemonApiResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=25`).pipe(
      map(result => {
        return result.results;
      }),
      // 7. Se retorna la imagen y se añade el index + el offset (o sea la posición 0 de la
      // lista + 1)
      // NOTA: Es por eso que el arreglo que regresa tiene image, name, pokeIndex y url
      map(pokemons => {
        return pokemons.map((poke, index) => {
          poke.image = this.getPokeImage(index + offset + 1);
          poke.pokeIndex = offset + index + 1;
          return poke;
        });
      })
    )
  }

  // 6. Función para obtener la imagen en base a imageUrl que se definió en el paso 2
  // NOTA: en "(index)" se debe específicar el tipo de dato para que no haya problema,
  // en este caso le puse number "(index: number)"
  getPokeImage(index: number) {
    return `${this.imageUrl}${index}.png`;
  }

  findPokemon(search: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${search}`).pipe(
      map((pokemon: any) => {
        pokemon['image'] = this.getPokeImage(pokemon['id']);
        pokemon['pokeIndex'] = pokemon['id'];
        return pokemon;
      })
    )
  }

  getPokeDetails(index: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${index}`).pipe(
      map(poke => {
        let sprites = Object.keys(poke['sprites']);
        poke['images'] = sprites
          .map(spriteKey => poke['sprites'][spriteKey])
          .filter(img => img);
        return poke;
      })
    );


  }
}
