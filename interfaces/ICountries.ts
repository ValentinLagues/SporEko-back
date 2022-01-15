import { RowDataPacket } from 'mysql2';

export default interface ICountries extends RowDataPacket {
  id_country: number;
  name: string;
}
