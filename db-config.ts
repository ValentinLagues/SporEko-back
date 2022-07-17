import 'dotenv/config';
import mysql, { Connection } from 'mysql2';

const connection: Connection = mysql.createConnection({
  host: ec2-54-76-43-89.eu-west-1.compute.amazonaws.com,
  port: 5432,
  user: iivnuzihfazuxo,
  password: 58978e89fd5c2a57846257d97951d54ef014900e5f0b4bc7e77310aa90b80199,
  database: dchgkdc5pmqfub,
});

export default connection;
