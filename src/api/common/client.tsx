import { Env } from '@env';
import axios from 'axios';
export const client = axios.create({
  baseURL: Env.MEDPLUM_BASE_URL,
});
