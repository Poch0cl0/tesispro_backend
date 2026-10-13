import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AcademicoModule } from './modules/academico/academico.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { MarketingModule } from './modules/marketing/marketing.module.js';
import { LeadsModule } from './modules/leads/leads.module.js';
import { ProyectosModule } from './modules/proyectos/proyectos.module.js';
import { ConversacionesModule } from './modules/conversaciones/conversaciones.module.js';
import { NegociacionModule } from './modules/negociacion/negociacion.module.js';
import { KpisModule } from './modules/kpis/kpis.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AcademicoModule,
    UsuariosModule,
    MarketingModule,
    LeadsModule,
    ProyectosModule,
    ConversacionesModule,
    NegociacionModule,
    KpisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
