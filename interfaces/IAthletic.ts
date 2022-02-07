import { RowDataPacket } from 'mysql2';

export default interface IAthletic extends RowDataPacket {
  id_athletic: number;
  name: string;
}
