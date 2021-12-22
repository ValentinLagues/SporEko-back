import { RowDataPacket } from 'mysql2';

export default interface ITextile extends RowDataPacket {
  name: string;
}