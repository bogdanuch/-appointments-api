import { ApiProperty } from '@nestjs/swagger';

export class appointmentDto {
  @ApiProperty({
    type: String,
    description: 'Name for the appointment',
    default: 'Interview',
  })
  appointmentName: string;

  @ApiProperty({
    type: Date,
    description: 'Date of the appointment end',
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      return date;
    },
  })
  appointmentStartDate: Date;

  @ApiProperty({
    type: Date,
    description: 'Date of the appointment start',
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 6);
      return date;
    },
  })
  appointmentEndDate: Date;
}
