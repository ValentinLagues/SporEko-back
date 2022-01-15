import { RowDataPacket } from 'mysql2';

export default interface IDeliverer_price extends RowDataPacket {
  id_item: number;
  weight: string;
  price: number;
  id_category: number;
}
