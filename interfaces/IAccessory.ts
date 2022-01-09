import { RowDataPacket } from 'mysql2';

export default interface IAccessory extends RowDataPacket {
  id_accessory: number;
  name: string;
}
