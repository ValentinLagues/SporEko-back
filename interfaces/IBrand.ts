import { RowDataPacket } from 'mysql2';

export default interface IBrand extends RowDataPacket {
  name: string;
}