import { RowDataPacket } from 'mysql2';

export default interface ISportifStyles extends RowDataPacket {
  name: string;
}