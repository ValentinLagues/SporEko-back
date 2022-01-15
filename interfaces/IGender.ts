import { RowDataPacket } from 'mysql2';

export default interface IGender extends RowDataPacket {
  id_gender: number;
  adult_name: string;
  child_name: string;
}
