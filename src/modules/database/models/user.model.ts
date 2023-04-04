import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

import { Appointment } from './appointment.model';

export interface IUser {
  email: string;
  password: string;
}

@Table({ timestamps: false, indexes: [{ fields: ['email'] }] })
export class User extends Model {
  @Expose()
  @Column({ allowNull: false, type: DataType.STRING, primaryKey: true })
  email: string;

  @Exclude()
  @Column({ allowNull: false, type: DataType.STRING })
  password: string;

  @Expose()
  @HasMany(() => Appointment, 'email')
  appointments: Appointment[];
}
