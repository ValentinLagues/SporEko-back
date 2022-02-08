import { RowDataPacket } from 'mysql2';

export default interface IDeliverer extends RowDataPacket {
  id_deliverer: number;
  name: string;
  weight_condition: number;
}
