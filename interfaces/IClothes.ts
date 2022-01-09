import { RowDataPacket } from 'mysql2';

export default interface IClothes extends RowDataPacket {
  id_clothes: number;
  name: string;
}
