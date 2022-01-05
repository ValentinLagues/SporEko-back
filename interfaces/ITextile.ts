import { RowDataPacket } from 'mysql2';

export default interface ITextile extends RowDataPacket {
  id_textile: number;
  name: string;
}