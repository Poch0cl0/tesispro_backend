import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MetodoPago, EstadoPago } from '../common/enums/database.enums.js';
import { Contrato } from './contrato.entity.js';
import { Lead } from './lead.entity.js';

@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  idPago: number;

  @Column({ name: 'id_contrato' })
  idContrato: number;

  @Column({ name: 'id_lead', type: 'bigint' })
  idLead: string;

  @Column({ name: 'nro_cuota', type: 'smallint', default: 1 })
  nroCuota: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  concepto: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: string;

  @Column({ type: 'char', length: 3, default: 'PEN' })
  moneda: string;

  @Column({ type: 'enum', enum: MetodoPago, enumName: 'metodo_pago', nullable: true })
  metodo: MetodoPago | null;

  @Column({ type: 'enum', enum: EstadoPago, enumName: 'estado_pago', default: EstadoPago.PENDIENTE })
  estado: EstadoPago;

  @Column({ name: 'referencia_operacion', type: 'varchar', length: 100, nullable: true })
  referenciaOperacion: string | null;

  @Column({ name: 'comprobante_url', type: 'text', nullable: true })
  comprobanteUrl: string | null;

  @Column({ name: 'fecha_pago', type: 'timestamptz', nullable: true })
  fechaPago: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Contrato)
  @JoinColumn({ name: 'id_contrato' })
  contrato: Contrato;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'id_lead' })
  lead: Lead;
}
