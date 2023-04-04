import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Expose } from 'class-transformer';

import { User } from './user.model';

export interface IAppointment {
  appointmentName: string;
  appointmentStartDate: string | Date;
  appointmentEndDate: string | Date;
  email?: string;
  user?: any;
  id?: number;
}

@Table({ timestamps: false, indexes: [{ unique: true, fields: ['id'] }] })
export class Appointment extends Model<IAppointment> {
  @Expose()
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @BelongsTo(() => User, 'email')
  user: User;

  @Expose()
  @Column({ allowNull: false, type: DataType.STRING })
  appointmentName: string;

  @Expose()
  @Column({ allowNull: false, type: DataType.DATE })
  appointmentStartDate: Date;

  @Expose()
  @Column({ allowNull: false, type: DataType.DATE })
  appointmentEndDate: Date;

  @Expose()
  get isExpired(): boolean {
    return this.appointmentEndDate < new Date();
  }
}
