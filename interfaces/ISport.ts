import { RowDataPacket } from 'mysql2';

export default interface ISport extends RowDataPacket {
  id_sport: number;
  name: string;
}