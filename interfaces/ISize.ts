import { RowDataPacket } from 'mysql2';

export default interface ISize extends RowDataPacket {
  id_size: number;
  id_gender: number;
  is_child: number;
  id_sizeType: number;
  size_int: string;
  size_eu: string;
  size_fr: string;
  size_uk: string;
  size_us: string;
  size_foot: string;
  size_chest: string;
  size_pool: string;
  size_jeans: string;
  age_child: string;
  height: string;
  hand_turn: string;
  size_glove: string;
  crotch: string;
  size_bike_inches: string;
  size_bike: string;
  size_wheel: string;
}
