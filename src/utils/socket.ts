import {io} from 'socket.io-client';
import {Constant} from './constant';

const domain: string = Constant.BASE_URL.split('/api')[0];

const socket = io(domain);

export default socket;
