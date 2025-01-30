import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  // Le service est injecté dans le contrôleur
  constructor(private readonly myService: AppService) {}

  @Get()
  getData() {
    // Les données stockées dans le service sont accessibles et la méthode getData() peut être appelée pour les récupérer. Ces données vont systématiquement être à jour avec les ajouts effectués par les autres contextes.
    return this.myService.getData();

  }

  @Post()
  addData(){
    // Les données stockées dans le service sont accessibles et la méthode addData() peut être appelée pour les modifier. Ces modifications vont systématiquement être visibles par les autres contextes.
    this.myService.addData("New data");

  }
}
