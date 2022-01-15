import { RowDataPacket } from 'mysql2';

export default interface ITWeight extends RowDataPacket {
  id_weight: number;
  name: string;
}
