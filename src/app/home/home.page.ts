import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

// 2. Implementar OnInit
export class HomePage implements OnInit{

  // 4. Declarar que inicie la lista en el elemento 0
  offset = 0;

  // P2 1. Definir array de pokemos
  // NOTA: Se añade que es de tipo "any[]", sino da error
  pokemon: any[] = [];

  // P4 1. Utilizar IonInfiniteScroll de otra forma con ViewChild, hay que poner undefined infinite
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll | undefined;

  // 1. Inyectar el servicio que se creó en pokemon service ts (PokemonService)
  constructor(private PokemonService: PokemonService) {}

  // 3. Declarar el OnInit
  ngOnInit() {
      this.loadPokemon();
  }

  // 5. Cargar la lista de pokemons
  // P3 1. Añadir loadMore para el inffinity scroll
  // Declarar el tipo de valor "any", sino da error
  loadPokemon(loadMore = false, event?: any) {
    if (loadMore) {
      this.offset += 25;
    }
    this.PokemonService.getPokemon(this.offset).subscribe(res => {
      // 6. Mostrar la variable res como resultado
      console.log('result: ', res);
      this.pokemon = [...this.pokemon, ...res];
      // Aquí sigue siendo P3

      // P2 2. Le decimos que el arreglo de pokemon es igual res
      // P3 Pase el this.pokemon = res al if
      // Lo sustitui por "this.pokemon = [...this.pokemon, ...res];"

      if (event) {
        event.target.complete();
      }

      // P4 2. De esta forma le decimos al IS que cargue máximo 150, o sea 125 + 25 que ya tenemos
      // Añadir && this.infinite para inicializar infinite
      if (this.offset == 125 && this.infinite) {
        this.infinite.disabled = true;
      }
    });
  }

  // P5 1. Añadir funcionalidad a search
  onSearchChange(e: any) {
    let value = e.detail.value;

    if (value == '') {
      this.offset = 0;
      this.loadPokemon();
      return;
    }

    this.PokemonService.findPokemon(value).subscribe(res => {
      this.pokemon = [res];
    }, err => {
      this.pokemon = [];
    });

  }

}
