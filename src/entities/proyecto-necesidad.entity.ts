import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProyectoTesis } from './proyecto-tesis.entity.js';
import { NecesidadAcademica } from './necesidad-academica.entity.js';

@Entity('proyecto_necesidad')
export class ProyectoNecesidad {
  @PrimaryColumn({ name: 'id_proyecto' })
  idProyecto: number;

  @PrimaryColumn({ name: 'id_necesidad' })
  idNecesidad: number;

  @Column({ type: 'smallint', default: 1, nullable: true })
  prioridad: number | null;

  @ManyToOne(() => ProyectoTesis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_proyecto' })
  proyecto: ProyectoTesis;

  @ManyToOne(() => NecesidadAcademica)
  @JoinColumn({ name: 'id_necesidad' })
  necesidad: NecesidadAcademica;
}
