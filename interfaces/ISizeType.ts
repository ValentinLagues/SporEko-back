import { RowDataPacket } from 'mysql2';

export default interface ISizeType extends RowDataPacket {
  id_sizeType: number;
  name: string;
}
