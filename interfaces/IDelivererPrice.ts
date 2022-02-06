import { RowDataPacket } from 'mysql2';

export default interface IDelivererPrice extends RowDataPacket {
  id_item: number;
  name: string;
  min_weight: number;
  max_weight: number;
  price: number;
  id_deliverer: number;
}
