import { RowDataPacket } from 'mysql2';

export default interface IDeliverer_price extends RowDataPacket {
  id_item: number;
  name: string;
<<<<<<< HEAD
  weight: string;
=======
  min_weight: number;
  max_weight: number;
>>>>>>> b254e4b7334a4087ccb58fb6ce06b1c35da41ccd
  price: number;
  id_deliverer: number;
}
