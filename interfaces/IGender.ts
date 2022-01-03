import { RowDataPacket } from 'mysql2';

export default interface IGender extends RowDataPacket {
  id_gender: number;
  name: string;
}
