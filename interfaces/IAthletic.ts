import { RowDataPacket } from 'mysql2';

export default interface IAthletic extends RowDataPacket {
  name: string;
}
